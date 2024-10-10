import { beforeEach, expect, it, vi } from 'vitest';
import { createCopyToClipboard } from './createCopyToClipboard';
import { Duration } from './utils';
import { renderHook } from './testUtils/browser';

const writeMock = vi.spyOn(navigator.clipboard, 'write');
const writeTextMock = vi.spyOn(navigator.clipboard, 'writeText');

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetAllMocks();
});

it('copies text to the clipboard', async () => {
  const {
    result: [, { onCopyText }],
  } = renderHook(createCopyToClipboard);

  await onCopyText('test value');

  expect(writeTextMock).toHaveBeenCalledOnce();
  expect(writeTextMock).toHaveBeenCalledWith('test value');
});

it('copies data to the clipboard', async () => {
  const {
    result: [, { onCopyData }],
  } = renderHook(createCopyToClipboard);

  const data: ClipboardItems = [
    new ClipboardItem({
      ['text/plain']: 'test value',
    }),
  ];

  await onCopyData(data);

  expect(writeMock).toHaveBeenCalledOnce();
  expect(writeMock).toHaveBeenCalledWith(data);
});

it('resets hasCopied after 1.5 seconds', async () => {
  const {
    result: [hasCopied, { onCopyText }],
  } = renderHook(createCopyToClipboard);

  await onCopyText('test value');

  expect(hasCopied()).toEqual(true);

  vi.advanceTimersByTime(Duration.milliseconds(1_500));

  expect(hasCopied()).toEqual(false);
});
