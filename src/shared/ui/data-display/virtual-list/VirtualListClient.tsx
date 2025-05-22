'use client';

import VirtualList from './VirtualList';
import type { VirtualListProps } from './VirtualList';

export function VirtualListClient<T>(props: VirtualListProps<T>) {
    return <VirtualList {...props} />;
} 