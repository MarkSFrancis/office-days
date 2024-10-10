import type { Locator, LocatorSelectors } from '@vitest/browser/context';
import {
  type PrettyDOMOptions,
  debug,
  getElementLocatorSelectors,
} from '@vitest/browser/utils';
import {
  createComponent,
  createRoot,
  getOwner,
  JSXElement,
  Owner,
  ParentComponent,
} from 'solid-js';
import { render as solidJsRender } from 'solid-js/web';

export interface RenderResult extends LocatorSelectors {
  container: HTMLElement;
  baseElement: HTMLElement;
  debug: (
    el?: HTMLElement | HTMLElement[] | Locator | Locator[],
    maxLength?: number,
    options?: PrettyDOMOptions
  ) => void;
  unmount: () => void;
}

export interface ComponentRenderOptions {
  container?: HTMLElement;
  baseElement?: HTMLElement;
}

type Mounted = {
  baseElement: Element | undefined;
  container: Element | undefined;
  dispose: () => void;
};

const mountedContainers = new Set<Mounted>();

export function render(
  ui: () => JSXElement,
  { container, baseElement }: ComponentRenderOptions = {}
): RenderResult {
  if (!baseElement) {
    baseElement = document.body;
  }

  if (!container) {
    container = baseElement.appendChild(document.createElement('div'));
  }

  const dispose = solidJsRender(() => ui(), container);

  const mounted: Mounted = { container, baseElement, dispose };
  mountedContainers.add(mounted);

  return {
    container,
    baseElement,
    debug: (...args) => debug(...args),
    unmount: () => cleanupAtContainer(mounted),
    ...getElementLocatorSelectors(container),
  };
}

export type RenderHookOptions<A extends unknown[]> =
  | {
      initialProps?: A;
      wrapper?: ParentComponent;
    }
  | A;

export type RenderHookResult<R> = {
  result: R;
  owner: Owner | null;
  cleanup: () => void;
};

export function renderHook<A extends unknown[], R>(
  hook: (...args: A) => R,
  options?: RenderHookOptions<A>
): RenderHookResult<R> {
  const initialProps: A | [] = Array.isArray(options)
    ? options
    : options?.initialProps || [];
  const [dispose, owner, result] = createRoot((dispose) => {
    if (
      typeof options === 'object' &&
      'wrapper' in options &&
      typeof options.wrapper === 'function'
    ) {
      let result: ReturnType<typeof hook>;
      options.wrapper({
        get children() {
          return createComponent(() => {
            result = hook(...(initialProps as A));
            return null;
          }, {});
        },
      });
      return [dispose, getOwner(), result!];
    }
    return [dispose, getOwner(), hook(...(initialProps as A))];
  });

  mountedContainers.add({
    dispose,
    // Element doesn't exist for hooks
    baseElement: undefined,
    container: undefined,
  });

  return { result, cleanup: dispose, owner };
}

function cleanupAtContainer(mounted: Mounted) {
  mounted.dispose();

  if (mounted.baseElement && mounted.container) {
    mounted.baseElement.removeChild(mounted.container);
  }

  mountedContainers.delete(mounted);
}

export function cleanup() {
  mountedContainers.forEach(cleanupAtContainer);
}
