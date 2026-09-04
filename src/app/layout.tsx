import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MG University Result Portal | CBCSS Fast Results & Analytics',
  description: 'Fast, modern result checker for Mahatma Gandhi University (MGU) CBCSS semester exams. Instant single lookups, batch class results, and PDF grade cards.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
        {children}
      </body>
    </html>
  );
}
