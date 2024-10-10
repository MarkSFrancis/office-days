import { render } from '~/lib/testUtils/browser';
import { HelloWorld } from './HelloWorld';
import { expect, it } from 'vitest';

it('Should render hello world', async () => {
  const screen = render(() => <HelloWorld />);
  const element = screen.getByText('Hello world!');

  await expect.element(element).toBeInTheDocument();
});
