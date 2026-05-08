'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Dynamic import wrapper for heavy components
export function DynamicComponent({
  importFn,
  fallback,
}: {
  importFn: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
}) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    importFn().then((mod) => {
      setComponent(() => mod.default);
      setIsLoading(false);
    });
  }, [importFn]);

  if (isLoading || !Component) {
    return <>{fallback}</>;
  }

  return <Component />;
}