import { FieldValues, useForm as useRvfForm } from '@rvf/remix';

type UseRvfFormProps<T extends FieldValues> = Parameters<
  typeof useRvfForm<T, T>
>[0];

export const useForm = <T extends FieldValues>(props: UseRvfFormProps<T>) =>
  useRvfForm<T, T>(props);
