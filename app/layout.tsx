import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/lib/ThemeContext';
import { PortfolioProvider } from '@/lib/PortfolioContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ChatbotWidget from '@/components/ui/ChatbotWidget';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'InvestMirror | Investment Portfolio & Behavioral Analyzer',
  description:
    'Gain deeper clarity into your financial habits. Analyze asset allocation, volatility exposure, and uncover your behavioral investing personality archetype.',
  icons: {
    icon: [
      { url: '/favicon/favicon.ico' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/favicon/site.webmanifest',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-300" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        <ThemeProvider>
          <PortfolioProvider>
            <Navbar />
            <div className="flex-1 pt-14 flex flex-col justify-between">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
            <ChatbotWidget />
          </PortfolioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
