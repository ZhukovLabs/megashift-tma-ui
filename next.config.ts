import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./shared/i18n/index.ts');

const nextConfig: NextConfig = {

};

export default withNextIntl(nextConfig);
