import type { Metadata } from 'next';
import { Inter, Noto_Sans_Kannada, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLang } from '@/lib/lang';
import { currentUser } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const kannada = Noto_Sans_Kannada({ subsets: ['kannada'], variable: '--font-kannada', display: 'swap' });
const devanagari = Noto_Sans_Devanagari({ subsets: ['devanagari'], variable: '--font-devanagari', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nextmind.example'),
  title: {
    default: 'NextMind — ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ಸರಳವಾಗಿ ವಿವರಿಸಲ್ಪಟ್ಟಿವೆ',
    template: '%s | NextMind',
  },
  description:
    'NextMind — Understand Karnataka Government schemes, scholarships and welfare programs in simple Kannada and English. Eligibility, documents, step-by-step guides and official links.',
  openGraph: {
    type: 'website',
    siteName: 'NextMind',
    locale: 'kn_IN',
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = getLang();
  let user = null;
  try {
    user = await currentUser();
  } catch {
    user = null;
  }

  return (
    <html lang={lang === 'kn' ? 'kn' : lang === 'hi' ? 'hi' : 'en'}>
      <body className={`${inter.variable} ${kannada.variable} ${devanagari.variable} antialiased`}>
        <Providers initialLang={lang} initialUser={user}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
