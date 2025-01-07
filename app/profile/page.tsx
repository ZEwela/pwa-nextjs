import { createClient } from '@/utilis/supabase/server';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getUserRole } from '../actions';

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = await getUserRole(user?.id);

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center gap-12">
      <div className="w-full">
        <div className="bg-accent flex items-center gap-3 rounded-md p-3 px-5 text-sm text-foreground">
          <InfoIcon size="16" strokeWidth={2} />
          This is a protected page that you can only see as an authenticated
          user
        </div>
      </div>
      <div className="flex flex-col items-start gap-2">
        <h2 className="mb-4 text-2xl font-bold">Your user details</h2>
        <pre className="max-h-32 overflow-auto rounded border p-3 font-mono text-xs">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      {role === 'admin' && (
        <div>
          <Link href="profile/add-event">
            <button>Add Event</button>
          </Link>
        </div>
      )}
    </div>
  );
}
