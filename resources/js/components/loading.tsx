import React from 'react';

interface LoadingProps {
  className?: string;
}

export default function Loading({ className = '' }: LoadingProps) {
  return (
    <span className={className}>
      Loading...
    </span>
  );
} 