import { telegramInit } from '@/shared/lib';
import { mockEnv } from '@/shared/lib/mock-env';

mockEnv();
telegramInit({ debug: process.env.NODE_ENV === 'development' });
