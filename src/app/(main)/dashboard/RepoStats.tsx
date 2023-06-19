'use client';

import { env } from '~/env.mjs';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import toast from '~/lib/toast';
import * as Switch from '@radix-ui/react-switch';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {
  options: {
    id: string;
    enabled: boolean;
  };
};

export default function RepoStats({ options }: Props) {
  const url = `${env.NEXT_PUBLIC_APP_URL}/repo-stats/${options.id}`;
  const handleCopy = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => toast.success('Copied link to clipboard!'))
      .catch(() => toast.error('Something went wrong!'));
  };

  const [enabled, setEnabled] = useState(options.enabled);
  const mutation = useMutation({
    mutationFn: ({
      enabled,
      regenerate,
    }: {
      enabled?: boolean;
      regenerate?: boolean;
    }) => {
      // if (enabled == undefined && regenerate == undefined)
      //   throw new Error('Invalid mutation arguments');

      return fetch(`${env.NEXT_PUBLIC_APP_URL}/repo-stats`, {
        method: 'PUT',
        body: JSON.stringify({ enabled, regenerate }),
      });
    },
    onError: () => {
      toast.error('Something went wrong!');
    },
    onSuccess: () => {
      toast.success('Updated successfully!');
    },
  });

  const handleToggle = () => {
    mutation.mutate({ enabled: !enabled });
    setEnabled(!enabled);
  };

  const router = useRouter();
  const handleRegenerate = () => {
    mutation.mutate({ regenerate: true });
    router.refresh(); // TODO: move to querying on the client
  };

  return (
    <div className="w-full p-6 rounded-md shadow-sm border border-gray-200">
      <div className="w-full flex justify-between">
        <h3 className="text-xl font-semibold mb-4">Repository Statistics</h3>
        <Switch.Root
          className={`relative inline-flex items-center h-5 w-12 flex-shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:border-red-500 focus:outline-none disabled:cursor-not-allowed ${
            enabled ? 'bg-red-500' : 'bg-gray-200'
          }`}
          onCheckedChange={handleToggle}
          disabled={mutation.isLoading}
        >
          <Switch.Thumb
            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full shadow ring-0 transition duration-200 ease-in-out bg-white ${
              enabled ? 'translate-x-7' : 'translate-x-0.5'
            }`}
          />
        </Switch.Root>
      </div>
      <div className="flex w-full mb-4">
        <p className="p-2 rounded-sm border border-gray-200 w-fit text-gray-900 font-mono mr-4 focus-visible:border-red-500 focus-visible:outline-none bg-gray-100 flex-1">
          {url}
        </p>
        <button
          className="py-1 px-2 rounded-sm border border-gray-200 text-gray-900 focus-visible:border-red-500 focus-visible:outline-none hover:bg-gray-100 disabled:cursor-not-allowed disabled:bg-gray-100 flex-shrink-0 flex-grow-0"
          onClick={handleCopy}
          disabled={!options.enabled}
        >
          <ClipboardIcon className="text-xl" />
        </button>
      </div>
      <button
        className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500"
        disabled={mutation.isLoading || !enabled}
        onClick={handleRegenerate}
      >
        Regenerate Link
      </button>
    </div>
  );
}
