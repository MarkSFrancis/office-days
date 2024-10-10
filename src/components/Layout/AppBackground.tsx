import { ParentComponent } from 'solid-js';
import { BlobsBackground } from './BlobsBackground';

export const AppBackground: ParentComponent = (props) => {
  const randomColors = [
    'hsl(200, 80%, 85%)',
    'hsl(189, 80%, 85%)',
    'hsl(160, 80%, 85%)',
    'hsl(215, 80%, 85%)',
    'hsl(194, 80%, 85%)',
    'hsl(170, 80%, 85%)',
    'hsl(220, 80%, 85%)',
  ] as const;

  return (
    <BlobsBackground blobColors={randomColors}>
      {props.children}
    </BlobsBackground>
  );
};
