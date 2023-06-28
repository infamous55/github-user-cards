'use client';

import { LockClosedIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { env } from '~/env.mjs';
import toast from '~/lib/toast';

export default async function Settings() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`${env.NEXT_PUBLIC_APP_URL}/user`, {
        method: 'DELETE',
      });
      if (!response.ok) return Promise.reject();
      else return response;
    },
    onSuccess: () => {
      toast.success('Deleted Successfully');
      router.push('/home');
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    retry: false,
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <LockClosedIcon className="w-6 h-6 mr-2 select-none text-red-500" />
        Settings
      </h1>
      <div className="w-full p-6 rounded-md shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Delete Your Account</h3>
        <p className="mb-4">
          Deleting your account removes all associated data. This action cannot
          be undone.
        </p>
        <button
          className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500"
          onClick={handleDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
