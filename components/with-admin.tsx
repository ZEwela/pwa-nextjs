import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/app/actions';
import { createClient } from '@/utilis/supabase/client';

export function withAdmin<T extends JSX.IntrinsicAttributes>(
  WrappedComponent: React.ComponentType<T>,
) {
  return function WithAdminWrapper(props: T) {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const checkUserRole = async () => {
        const supabase = await createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        try {
          const role = await getUserRole(user?.id); // Fetch the role for the logged-in user
          if (role === 'admin') {
            setIsAdmin(true);
          } else {
            router.push('/profile'); // Redirect non-admin users
          }
        } catch (error) {
          console.error('Error checking user role:', error);
          router.push('/profile'); // Handle error by redirecting
        } finally {
          setIsLoading(false);
        }
      };

      checkUserRole();
    }, [router]);

    if (isLoading) {
      return <div>Loading...</div>; // Show a loading state while checking the user's role
    }

    if (!isAdmin) {
      return null; // Do not render anything for non-admin users
    }

    return <WrappedComponent {...props} />;
  };
}
