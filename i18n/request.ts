import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

const supportedLocales = ['en', 'ar'];

export default getRequestConfig(async () => {
    const store = await cookies();
    const requestedLocale = store.get('locale')?.value || 'en';
    const locale = supportedLocales.includes(requestedLocale) ? requestedLocale : 'en';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default
    };
});