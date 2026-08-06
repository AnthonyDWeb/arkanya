import { cn } from '../lib/cn';

export type QueryFeedbackProps = {
  errorMessage?: string | null;
  loadingMessage: string;
  isLoading: boolean;
  isEmpty: boolean;
  className?: string;
};

export const QueryFeedback = ({
  className,
  errorMessage = null,
  isEmpty,
  isLoading,
  loadingMessage,
}: QueryFeedbackProps) => {
  if (errorMessage) {
    return (
      <div data-state="error" className={cn('ark-query-feedback', className)}>
        {errorMessage}
      </div>
    );
  }

  if (isLoading && isEmpty) {
    return (
      <div data-state="loading" className={cn('ark-query-feedback', className)}>
        {loadingMessage}
      </div>
    );
  }

  return null;
};
