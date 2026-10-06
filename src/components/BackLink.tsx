import type { ReactNode } from 'react';

export function BackLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} className={`inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-black ${className}`}>
      <span aria-hidden="true">←</span>
      <span className="inline-flex items-center gap-2">Back to {children}</span>
    </a>
  );
}
