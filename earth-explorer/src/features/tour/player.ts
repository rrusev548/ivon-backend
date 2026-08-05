import { flyToPose } from '../../cesium/camera';
import { useViewer } from '../../cesium/viewerContext';
import { appStore } from '../../store';

let resumeIndex = 0;
let pauseRequested = false;
let stopRequested = false;

/**
 * Cinematic tour playback: chain camera flights through the recorded
 * keyframes. Pause cancels the current flight but remembers the leg so
 * play resumes from it; stop resets to the beginning.
 */
export async function playTour(): Promise<void> {
  const store = appStore.getState();
  if (store.playback === 'playing') return;
  const startIndex = store.playback === 'paused' ? resumeIndex : 0;

  pauseRequested = false;
  stopRequested = false;
  store.setPlayback('playing');

  const viewer = useViewer();
  // Lock camera input during playback: any gesture (even residual zoom
  // inertia from just before pressing play) would cancel the flight.
  viewer.scene.screenSpaceCameraController.enableInputs = false;
  try {
    const { keyframes } = appStore.getState();
    for (let i = startIndex; i < keyframes.length; i++) {
      const frame = keyframes[i];
      if (!frame) continue;
      appStore.getState().setActiveKeyframeIndex(i);
      const finished = await flyToPose(viewer, frame.pose, frame.durationSec);
      if (!finished) {
        if (pauseRequested) {
          resumeIndex = i;
          appStore.getState().setPlayback('paused');
        } else {
          reset();
        }
        return;
      }
      if (stopRequested) {
        reset();
        return;
      }
    }
    reset();
  } finally {
    viewer.scene.screenSpaceCameraController.enableInputs = true;
  }
}

export function pauseTour(): void {
  if (appStore.getState().playback !== 'playing') return;
  pauseRequested = true;
  useViewer().camera.cancelFlight();
}

export function stopTour(): void {
  const { playback } = appStore.getState();
  if (playback === 'stopped') return;
  stopRequested = true;
  pauseRequested = false;
  useViewer().camera.cancelFlight();
  if (playback === 'paused') reset();
}

function reset(): void {
  resumeIndex = 0;
  appStore.getState().setPlayback('stopped');
  appStore.getState().setActiveKeyframeIndex(-1);
}
