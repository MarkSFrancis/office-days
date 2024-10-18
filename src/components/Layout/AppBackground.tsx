import { Component, ComponentProps, createMemo, splitProps } from 'solid-js';
import { BlobsBackground } from './BlobsBackground';

export interface AppBackgroundProps extends ComponentProps<'div'> {
  colorsSeed?: string;
}

export const AppBackground: Component<AppBackgroundProps> = (props) => {
  const [local, other] = splitProps(props, ['colorsSeed']);

  const randomColors = createMemo(() => {
    let seed;
    if (local.colorsSeed !== undefined) {
      seed = seedToNumber(local.colorsSeed);
    } else {
      seed = 160;
    }

    const randomColors = shiftColorsBy(seed);
    return randomColors;
  });

  return <BlobsBackground blobColors={randomColors()} {...other} />;
};

const shiftColorsBy = (shiftAmount: number) => {
  return [
    `hsl(${(40 + shiftAmount) % 360}, 80%, 85%)`,
    `hsl(${(29 + shiftAmount) % 360}, 80%, 85%)`,
    `hsl(${(0 + shiftAmount) % 360}, 80%, 85%)`,
    `hsl(${(55 + shiftAmount) % 360}, 80%, 85%)`,
    `hsl(${(34 + shiftAmount) % 360}, 80%, 85%)`,
    `hsl(${(10 + shiftAmount) % 360}, 80%, 85%)`,
    `hsl(${(60 + shiftAmount) % 360}, 80%, 85%)`,
  ] as const;
};

const seedToNumber = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};
