'use client';

import { EyeOpenIcon, EyeNoneIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChangeEvent, useState } from 'react';
import { env } from '~/env.mjs';
import toast from '~/lib/toast';

export default function GithubPat({ pat: initialPat }: { pat: string }) {
  const [pat, setPat] = useState(initialPat);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPat(event.target.value);
  };

  const check = useQuery({
    queryKey: ['check-pat'],
    staleTime: Infinity,
    retry: false,
    queryFn: async () => {
      const response = await fetch('https://api.github.com/user/repos', {
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${pat}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      });
      if (!response.ok) return Promise.reject();
      else return response;
    },
  });

  const [hidden, setHidden] = useState(true);
  const handleToggle = () => {
    setHidden(!hidden);
  };

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${env.NEXT_PUBLIC_APP_URL}/github-pat`, {
        method: 'PUT',
        body: JSON.stringify({ token: pat }),
      });
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      toast.success('Updated successfully!');
    },
  });
  const handleSubmit = () => {
    mutation.mutate();
    check.refetch();
  };

  return (
    <div className="w-full p-6 rounded-md shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Personal Access Token</h3>
      <p className="mb-4">
        Please provide a valid fine-grained personal access token with read
        permissions for your public and private repositories.
      </p>
      <div className="flex mb-4">
        <input
          type={hidden ? 'password' : 'text'}
          value={pat}
          className="p-2 rounded-sm border border-gray-200 w-full mr-4 text-gray-900 font-mono focus-visible:border-red-500 focus-visible:outline-none bg-gray-100"
          onChange={(event) => handleChange(event)}
          disabled={mutation.isLoading}
        />
        <button
          className="py-1 px-2 rounded-sm border border-gray-200 text-gray-900 focus-visible:border-red-500 focus-visible:outline-none hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 flex-shrink-0 flex-grow-0"
          onClick={handleToggle}
          disabled={mutation.isLoading}
        >
          {hidden ? (
            <EyeOpenIcon className="text-xl" />
          ) : (
            <EyeNoneIcon className="text-xl" />
          )}
        </button>
      </div>
      <p
        className={`${
          check.isSuccess
            ? 'text-green-500'
            : check.isError
            ? 'text-red-500'
            : 'text-yellow-500'
        } mb-4`}
      >
        {check.isSuccess
          ? 'Your token is valid!'
          : check.isError
          ? 'Your token is incorrect!'
          : 'Verifying your token...'}
      </p>
      <button
        className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500"
        onClick={handleSubmit}
        disabled={mutation.isLoading}
      >
        Save
      </button>
    </div>
  );
}
