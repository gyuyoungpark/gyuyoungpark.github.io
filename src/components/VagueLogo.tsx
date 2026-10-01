import { cn } from '@/lib/utils';

export function VagueLogo({ className }: { className?: string }) {
  return (
    <img
      src="/images/brand/vague.svg"
      alt="VAGUE"
      width={462}
      height={96}
      className={cn('inline-block h-[1cap] w-auto shrink-0 align-baseline', className)}
    />
  );
}
