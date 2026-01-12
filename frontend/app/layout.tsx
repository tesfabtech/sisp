import './globals.css';

export const metadata = {
  title: 'SISP – Sidama Innovation & Startup Portal',
  description: 'Connecting startups, mentors, investors, and opportunities in Sidama',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
        {children}
      </body>
    </html>
  );
}
