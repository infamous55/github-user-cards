'use client';

import { env } from '~/env.mjs';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import toast from '~/lib/toast';
import * as Switch from '@radix-ui/react-switch';
import { useMutation, useQuery } from '@tanstack/react-query';

import type { Database } from '~/lib/database.types';

export default function RepoStats({
  options,
  type,
}: {
  options: {
    id: string;
    enabled: boolean;
  };
  type: 'repo-stats' | 'top-langs';
}) {
  const [url, setUrl] = useState(
    `${env.NEXT_PUBLIC_APP_URL}/${type}/${options.id}`
  );
  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Copied link to clipboard!'))
      .catch(() => toast.error('Something went wrong!'));
  };

  const [enabled, setEnabled] = useState(options.enabled);
  const toggleMutation = useMutation({
    mutationFn: () => {
      return fetch(`${env.NEXT_PUBLIC_APP_URL}/${type}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: !enabled }),
      });
    },
  });
  const handleToggle = async () => {
    await toggleMutation.mutateAsync();
    if (!toggleMutation.isError) {
      setEnabled(!enabled);
      toast.success('Updated successfully!');
    } else toast.error('Something went wrong!');
  };

  const { refetch } = useQuery({
    queryKey: [type],
    queryFn: async () => {
      return fetch(`${env.NEXT_PUBLIC_APP_URL}/${type}`).then((response) =>
        response.json()
      );
    },
    enabled: false,
    // onSuccess is getting deprecated, should move to useEffect
    // The type of data is dependent on the API response
    onSuccess: (
      data:
        | Database['public']['Tables']['repo_stats']['Row']
        | Database['public']['Tables']['top_langs']['Row']
    ) => {
      setUrl(`${env.NEXT_PUBLIC_APP_URL}/${type}/${data.id}`);
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: () => {
      return fetch(`${env.NEXT_PUBLIC_APP_URL}/${type}/regenerate`, {
        method: 'POST',
      });
    },
  });
  const handleRegenerate = async () => {
    await regenerateMutation.mutateAsync();
    if (!regenerateMutation.isError) {
      toast.success('Updated successfully!');
      refetch();
    } else toast.error('Something went wrong!');
  };

  return (
    <div className="w-full p-6 rounded-md shadow-sm border border-gray-200">
      <div className="w-full flex justify-between">
        <h3 className="text-xl font-semibold mb-4">
          {type === 'repo-stats' ? 'Repository Statistics' : 'Top Languages'}
        </h3>
        <Switch.Root
          className={`relative inline-flex items-center h-5 w-12 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:border-red-500 focus:outline-none disabled:cursor-not-allowed ${
            enabled ? 'bg-red-500' : 'bg-gray-200'
          }`}
          onCheckedChange={handleToggle}
          disabled={toggleMutation.isLoading}
        >
          <Switch.Thumb
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-white ${
              enabled ? 'translate-x-7' : 'translate-x-0.5'
            }`}
          />
        </Switch.Root>
      </div>
      <div className="flex w-full mb-4">
        {/* The URL field is easier to style when using an input rather than a paragraph */}
        <input
          type="text"
          value={url}
          className="p-2 rounded-sm border border-gray-200 w-full mr-4 text-gray-900 font-mono select-none bg-gray-100 text-ellipsis"
          disabled={true}
        />
        {/* <p className="p-2 rounded-sm border border-gray-200 w-fit text-gray-900 font-mono mr-4 focus-visible:border-red-500 focus-visible:outline-none bg-gray-100 flex-1">
          {url}
        </p> */}
        <button
          className="py-1 px-2 rounded-sm border border-gray-200 text-gray-900 focus-visible:border-red-500 focus-visible:outline-none hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 flex-shrink-0 flex-grow-0"
          onClick={handleCopy}
          disabled={!enabled}
        >
          <ClipboardIcon className="text-xl" />
        </button>
      </div>
      <button
        className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500"
        disabled={regenerateMutation.isLoading || !enabled}
        onClick={handleRegenerate}
      >
        Regenerate Link
      </button>
    </div>
  );
}
