import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/session';
import LoginForm from './LoginForm';

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session.userId) redirect('/admin');

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
