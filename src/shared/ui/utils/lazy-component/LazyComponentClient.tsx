'use client';

import { LazyComponent } from './LazyComponent';

import type { LazyComponentProps } from './LazyComponent';

export function LazyComponentClient<T>(props: LazyComponentProps<T>) {
  return <LazyComponent {...props} />;
}
