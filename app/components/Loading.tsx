import { cn } from '~/lib/utils';
import { Loader2, LucideProps } from 'lucide-react';
import { FC } from 'react';

export interface LoadingProps extends Omit<LucideProps, 'ref'> {
  center?: boolean;
}

/**
 * Show a loading icon. Can optionally center it with `center`
 */
export const Loading: FC<LoadingProps> = ({ className, center, ...rest }) => {
  return (
    <Loader2
      {...rest}
      className={cn(
        'animate-spin',
        !!center &&
          'self-center place-self-center justify-self-center align-middle',
        className
      )}
    />
  );
};

/**
 * Show that a section of the page is loading
 */
export const SectionLoading: FC<LoadingProps> = ({ className, ...rest }) => {
  return (
    <div className="grow flex justify-center items-center">
      {rest.children}
      <Loading size={48} {...rest} className={cn('', className)} />
    </div>
  );
};
