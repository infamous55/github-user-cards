'use client';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 flex items-center">
        <ExclamationTriangleIcon className="w-6 h-6 mr-2 -mb-1 select-none text-red-500" />
        Error
      </h1>
      <div className="w-full p-6 rounded-md shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold mb-4">Something went wrong!</h3>
        <p className="mb-4">
          It seems that there is a server error or you might be offline. Please
          check your internet connection or try again later.
        </p>
        <button
          className="px-4 py-2 min-w-[9rem] font-semibold text-white rounded-md shadow-sm bg-red-600 hover:bg-red-500 focus-visible:outline-none focus-visible:bg-red-500"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </>
  );
}
