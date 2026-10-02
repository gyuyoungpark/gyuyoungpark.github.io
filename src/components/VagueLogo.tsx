import { cn } from '@/lib/utils';

export function VagueLogo({ className }: { className?: string }) {
  return (
    <span className={cn('vague-wordmark', className)}>VAGUE</span>
  );
}
