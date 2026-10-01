import { cn } from '@/lib/utils';

export function VagueLogo({ className }: { className?: string }) {
  return (
    <img
      src="/images/brand/vague.svg"
      alt="VAGUE"
      width={480}
      height={112}
      className={cn('inline-block h-auto shrink-0 align-middle', className)}
    />
  );
}
