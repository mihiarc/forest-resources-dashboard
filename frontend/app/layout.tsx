import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'U.S. Forest Resources Dashboard',
  description: 'Interactive dashboard for U.S. Forest Resources 2022 data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-forest-700 text-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                    <a href="/" className="flex items-center gap-2">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      <span className="font-bold text-lg">
                        U.S. Forest Resources
                      </span>
                    </a>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      <a
                        href="/"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-forest-600"
                      >
                        Overview
                      </a>
                      <a
                        href="/land-area"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-forest-600"
                      >
                        Land Area
                      </a>
                      <a
                        href="/ownership"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-forest-600"
                      >
                        Ownership
                      </a>
                      <a
                        href="/trends"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-forest-600"
                      >
                        Trends
                      </a>
                      <a
                        href="/timber"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-forest-600"
                      >
                        Timber Volume
                      </a>
                      <a
                        href="/dynamics"
                        className="px-3 py-2 rounded-md text-sm font-medium hover:bg-forest-600"
                      >
                        Dynamics
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-center text-sm text-gray-500">
                  Data source: USDA Forest Service - Forest Inventory and Analysis
                  Program (2022 Appendix Tables)
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
