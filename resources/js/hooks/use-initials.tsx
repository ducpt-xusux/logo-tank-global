import React, {useCallback, useEffect, useRef} from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        const names = fullName.trim().split(' ');

        if (names.length === 0) return '';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}

export function useDebouncedEffect(
  callback: () => void,
  deps: React.DependencyList,
  delay: number
): void {
    const isFirstRun = useRef(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callback();
        }, delay);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [...deps, delay]);
}
