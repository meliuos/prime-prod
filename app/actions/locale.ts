'use server';

import { cookies } from 'next/headers';

export async function setLocale(locale: string) {
  const store = await cookies();
  store.set({ name: 'locale', value: locale, path: '/', sameSite: 'lax' });
}
