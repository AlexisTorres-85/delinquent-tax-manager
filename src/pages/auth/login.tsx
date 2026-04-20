import { useAuth } from '@/auth';
import { Button } from '@/components/ui/button';
import { toAbsoluteUrl } from '@/lib/helpers';

export function LoginPage() {
  const { login } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={toAbsoluteUrl('/images/dtm-logo.svg')}
            alt="DTM"
            className="w-32"
          />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Use your organisation account to continue
          </p>
        </div>

        {/* Sign-in button */}
        <Button className="w-full" onClick={login}>
          Sign in with Microsoft
        </Button>

        <p className="text-xs text-muted-foreground">
          Powered by Azure Entra ID
        </p>
      </div>
    </div>
  );
}
