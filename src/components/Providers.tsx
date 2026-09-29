'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Lang, User } from '@/lib/types';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  user: User | null;
  setUser: (u: User | null) => void;
}

const AppContext = createContext<AppContextValue>({
  lang: 'kn',
  setLang: () => {},
  user: null,
  setUser: () => {},
});

export function useApp() {
  return useContext(AppContext);
}

export function useLang(): Lang {
  return useContext(AppContext).lang;
}

export default function Providers({
  initialLang,
  initialUser,
  children,
}: {
  initialLang: Lang;
  initialUser: User | null;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setLangState(initialLang);
  }, [initialLang]);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const setLang = (l: Lang) => {
    setLangState(l);
    document.cookie = `nm_lang=${l};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    document.documentElement.lang = l;
    setTimeout(() => {
      window.location.reload();
    }, 150);
  };

  return (
    <AppContext.Provider value={{ lang, setLang, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
