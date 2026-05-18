import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/auth/use-auth';
import { toast } from 'sonner';

export function AccessDeniedPage() {
  const { logout } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    department: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.reason) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const subject = encodeURIComponent('DTM Access Request');
    const body = encodeURIComponent(
      `DTM Access Request\n` +
      `──────────────────\n` +
      `Full Name:  ${form.fullName}\n` +
      `Email:      ${form.email}\n` +
      `Department: ${form.department || 'N/A'}\n\n` +
      `Reason for Access:\n${form.reason}`
    );
    window.location.href = `mailto:alexis.torres@kenoshacountywi.gov?subject=${subject}&body=${body}`;

    setSubmitted(true);
    toast.success('Your email client has been opened with the request details.');
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-tl from-[#15803d] -mt-40 via-[#115e59] to-[#164e63] flex flex-col items-center justify-center overflow-y-auto z-50">
      {/* Logo */}
      <div className="mb-6">
        <img
          src={toAbsoluteUrl('/images/dtm-logo-white.svg')}
          alt="DTM"
          className="w-46"
        />
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl shadow-lg">
        {/* Header band */}
        <div className="bg-app-primary px-8 py-6 rounded-t-2xl text-center border-b-2 border-red-500">
          <AlertTriangle className="mx-auto mb-2 size-10 text-red-500" strokeWidth={2} />
          <h1 className="text-2xl font-bold tracking-widest text-primary-foreground uppercase">
            Access Denied
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/70">
            Your account does not currently have permission to access DTM.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-7 space-y-5 bg-muted rounded-b-2xl">
          {submitted ? (
            <div className="text-center py-6 space-y-2">
              <p className="text-base font-semibold text-foreground">Request submitted!</p>
              <p className="text-sm text-muted-foreground">
                An administrator will review your request and grant access if approved.
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                If you've been granted access, refresh the page to sign in.
              </p>
              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full" onClick={() => window.location.reload()}>
                  Refresh page
                </Button>
                <Button variant="outline" className="w-full" onClick={logout}>
                  Sign out
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <p className="text-2xl font-semibold text-foreground pb-4">
                Request Access
              </p>

              {/* Full Name + Email */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="johndoe@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Department */}
              <Input
                label="Department"
                name="department"
                placeholder="e.g. Tax Collections"
                value={form.department}
                onChange={handleChange}
              />

              {/* Reason */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Reason for Access</label>
                <Textarea
                  name="reason"
                  placeholder="Please provide a brief justification for requesting access to DTM…"
                  rows={4}
                  value={form.reason}
                  onChange={handleChange}
                  required
                />
              </div>


              <Button type="submit" className="w-full">
                Submit Request
              </Button>

              <div className="text-center pt-1">
                <p className="text-sm text-muted-foreground">
                  Already have access?{' '}
                  <button
                    type="button"
                    className="underline hover:text-foreground transition-colors"
                    onClick={() => window.location.reload()}
                  >
                    Refresh page
                  </button>
                  {' · '}
                  <button
                    type="button"
                    className="underline hover:text-foreground transition-colors"
                    onClick={logout}
                  >
                    Sign out
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
