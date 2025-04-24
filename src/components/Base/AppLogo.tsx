import React from 'react';

export default function EclipseLogo() {
  return (
    <div className="flex items-center space-x-3 bg-white">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-black rounded-full" />
        <div className="absolute w-10 h-10 bg-white rounded-full left-1 top-0" />
      </div>
      <span className="z-10 -ml-10 text-2xl font-medium tracking-tight text-gray-900 uppercase font-[Helvetica]">
        Eclipse
      </span>
    </div>
  );
}
