import type { useSubmission, useSubmissions } from '@solidjs/router';
import { createEffect } from 'solid-js';
import { showToast } from '~/components/ui/toast';

type Submission = ReturnType<typeof useSubmission>;
type Submissions = ReturnType<typeof useSubmissions>;

export type ToastOptions = Parameters<typeof showToast>[0];
export type SubmissionToastOptions<TSubmission extends Submission> =
  | ToastOptions
  | ((submission: TSubmission, errorMessage: string) => ToastOptions);

export const toastSubmissions = <TSubmissions extends Submissions>(
  submissions: TSubmissions,
  defaultOptions: SubmissionToastOptions<TSubmissions[number]> = {}
) => {
  createEffect(() => {
    submissions.forEach((submission) => {
      displayToastForSubmission(submission, defaultOptions);
    });
  });
};

export const toastSubmission = <TSubmission extends Submission>(
  submission: TSubmission,
  defaultOptions: SubmissionToastOptions<TSubmission> = {}
) => {
  createEffect(() => {
    displayToastForSubmission(submission, defaultOptions);
  });
};

const displayToastForSubmission = <TSubmission extends Submission>(
  submission: TSubmission,
  options: SubmissionToastOptions<TSubmission> = {}
) => {
  if (!submission.error) return;

  const err = submission.error as unknown;
  submission.clear();

  let errorMessage: string;
  if (typeof err === 'string') {
    errorMessage = err;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  } else {
    errorMessage = 'An error occurred';
  }

  const overrides =
    typeof options === 'function' ? options(submission, errorMessage) : options;

  showToast({
    title: 'Something went wrong',
    description: errorMessage,
    variant: 'destructive',
    ...overrides,
  });
};
