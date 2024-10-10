import { Component, mergeProps } from 'solid-js';
import { Button, ButtonProps } from '../ui/button';
import { useFormContext } from './Form';

export const SubmitButton: Component<ButtonProps> = (props) => {
  const { submitProps } = useFormContext();

  const merged = mergeProps(submitProps, props);

  return <Button {...merged} />;
};
