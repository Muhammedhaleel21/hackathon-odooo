import { Suspense } from 'react';
import { ResetPasswordForm } from '../../../components/auth/reset-password-form';
import { Loader2 } from 'lucide-react';

export const metadata = {
  title: 'Reset Password — Brightloop',
  description: 'Enter your new password to restore account access',
};

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md p-8 rounded-2xl bg-gray-900/80 border border-white/10 flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
