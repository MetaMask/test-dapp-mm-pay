import type { UseQueryResult } from '@tanstack/react-query';

import { cn } from '@/lib/utils';

export function Status(
  props: {
    label: string;
    children?: React.ReactNode;
  } & Partial<
    Pick<UseQueryResult<any, any>, 'isLoading' | 'isSuccess' | 'error'>
  >,
) {
  const idle = !props.isLoading && !props.isSuccess && !props.error;
  return (
    <div className="flex justify-between gap-x-8 text-xs">
      <div className="text-muted-foreground">{props.label}</div>
      <div
        className={cn(
          'text-right text-xs font-bold text-muted-foreground',
          props.error && 'text-red-500',
          props.isSuccess && 'text-green-500',
        )}
      >
        {idle && 'Idle 💤'}
        {!props.error && props.isLoading && 'Waiting ⏳'}
        {props.error && 'Error ❌'}
        {props.isSuccess && 'Success ✅'}
      </div>
    </div>
  );
}
