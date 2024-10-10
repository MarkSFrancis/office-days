import { createEffect, createSignal } from 'solid-js';
import { Duration } from './utils';

const CLIPBOARD_TIMEOUT = Duration.milliseconds(1_500);

export function createCopyToClipboard() {
  const [hasCopied, setHasCopied] = createSignal(false);

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
   */
  const onCopyText = async (value: string) => {
    if (!('clipboard' in navigator)) {
      throw new Error('Clipboard is not supported in this browser');
    }

    await navigator.clipboard.writeText(value);
    setHasCopied(true);
  };

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write
   */
  const onCopyData = async (value: ClipboardItems) => {
    if (!('clipboard' in navigator)) {
      throw new Error('Clipboard is not supported in this browser');
    }

    await navigator.clipboard.write(value);
    setHasCopied(true);
  };

  createEffect(() => {
    let timeoutId: number | undefined;

    if (hasCopied()) {
      timeoutId = window.setTimeout(() => {
        setHasCopied(false);
      }, CLIPBOARD_TIMEOUT);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  });

  return [hasCopied, { onCopyText, onCopyData }] as const;
}
