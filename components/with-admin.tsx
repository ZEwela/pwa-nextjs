'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utilis/supabase/client';
import { getUserRole } from '@/app/actions';

export function withAdmin<P extends object>(
  WrappedComponent: React.ComponentType<P>,
) {
  return function WithAdminComponent(props: P) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkUserRole = async () => {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/sign-in');
          return;
        }

        try {
          const role = await getUserRole(user.id);
          if (role === 'admin') {
            setIsAdmin(true);
          } else {
            router.push('/profile');
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          router.push('/profile');
        } finally {
          setIsLoading(false);
        }
      };

      checkUserRole();
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      );
    }

    if (!isAdmin) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
