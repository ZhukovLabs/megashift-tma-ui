import { QueryClient } from '@tanstack/react-query';

const invalidateTimers = new Map<string, ReturnType<typeof setTimeout>>();

export function scheduleCancelAndInvalidate(
    queryClient: QueryClient,
    queryKey: ReadonlyArray<string | number>,
    delay = 120
) {
    const keyStr = JSON.stringify(queryKey);

    const existing = invalidateTimers.get(keyStr);
    if (existing) {
        clearTimeout(existing);
    }

    const timer = setTimeout(async () => {
        invalidateTimers.delete(keyStr);
        try {
            await queryClient.cancelQueries({ queryKey, exact: true });
        } catch (e) {
        }
        queryClient.invalidateQueries({ queryKey, exact: true });
    }, delay);

    invalidateTimers.set(keyStr, timer);
}
