import { MetaArgs } from '@remix-run/react';

export const getTitle = (
  ctx: MetaArgs,
  name?: null | string | number | (string | number)[]
) => {
  const previousParts = ctx.matches
    .map((m) => m.meta)
    .flatMap((m) => m.filter((m): m is { title: string } => 'title' in m))
    .map((m) => m.title);

  const titleParts: string[] = [...previousParts];
  if (typeof name === 'string' || typeof name === 'number') {
    titleParts.push(String(name));
  } else if (Array.isArray(name)) {
    titleParts.push(...name.map((c) => String(c)));
  }

  return titleParts.reverse().join(' | ');
};
