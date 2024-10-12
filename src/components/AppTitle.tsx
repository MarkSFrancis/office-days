import { Title } from '@solidjs/meta';
import { Component, ComponentProps, createMemo } from 'solid-js';

export const APP_TITLE = 'Office Days';

export const AppTitle: Component<ComponentProps<'title'>> = (props) => {
  const title = createMemo(() => {
    let titleParts: string[] | undefined;
    if (typeof props.children === 'string') {
      titleParts = [props.children, APP_TITLE];
    } else if (Array.isArray(props.children)) {
      if (
        props.children.every(
          (child) => typeof child === 'string' || typeof child === 'number'
        )
      ) {
        titleParts = [...props.children.map((c) => String(c)), APP_TITLE];
      }
    } else if (props.children === undefined || props.children === null) {
      titleParts = [APP_TITLE];
    }

    if (titleParts) {
      return titleParts.join(' | ');
    } else {
      return props.children;
    }
  });

  return <Title {...props}>{title()}</Title>;
};
