import { ParentComponent } from 'solid-js';
import { BlobsBackground } from './BlobsBackground';

export const AppBackground: ParentComponent = (props) => {
  const randomColors = [
    'hsl(138.15512214821615, 80%, 85%)',
    'hsl(189.1971609580604, 80%, 85%)',
    'hsl(176.0860937821101, 80%, 85%)',
    'hsl(215.05842363349277, 80%, 85%)',
    'hsl(194.4125745784938, 80%, 85%)',
    'hsl(16.000698784967394, 80%, 85%)',
    'hsl(89.53455130163934, 80%, 85%)',
  ] as const;

  return (
    <BlobsBackground blobColors={randomColors}>
      {props.children}
    </BlobsBackground>
  );
};
