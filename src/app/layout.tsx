import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';

// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Distractions',
  description: 'Curated links and regular browsing spots',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}