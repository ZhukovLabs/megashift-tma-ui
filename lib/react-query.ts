'use client';

import {
    QueryClient,
    QueryCache,
    MutationCache,
} from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

const showErrorToast = (error: unknown) => {
    let message = 'Произошла ошибка';

    if (axios.isAxiosError(error)) {
        message = error.response?.data?.message ?? 'Ошибка запроса';
    } else if (error instanceof Error) {
        message = error.message;
    }

    toast.error(message);
};

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: showErrorToast,
    }),

    mutationCache: new MutationCache({
        onError: showErrorToast,
    }),

    defaultOptions: {
        queries: {
            retry: 3,
        },
    },
});
