import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UMich Q&A Hub",
  description: "Questions, answers, and resources for UMich prospects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950`}>
        <div className="app-shell flex flex-col min-h-screen relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-6000"></div>
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-8000"></div>
          </div>

          {/* Header */}
          <header className="glass-effect dreamy-glow m-4 rounded-3xl sticky top-4 z-50 backdrop-blur-xl border-2 border-purple-500/30">
            <div className="px-8 py-8">
              <div className="gradient-text text-6xl font-bold mb-2 floating-animation">
                🚀 UMich Q&A Hub
              </div>
              <div className="text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-xl font-semibold">
                Ask, answer, and share resources with the community
              </div>
            </div>
            <nav className="nav flex gap-6 px-8 pb-6 flex-wrap">
              <a href="/" className="nav-btn-home group">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">🏠</span>
                  <span>Home</span>
                </span>
              </a>
              <a href="/ask" className="nav-btn-ask group">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">💬</span>
                  <span>Ask / Share</span>
                </span>
              </a>
              <a href="/admin" className="nav-btn-admin group">
                <span className="flex items-center gap-2">
                  <span className="text-2xl">⚙️</span>
                  <span>Admin</span>
                </span>
              </a>
            </nav>
          </header>

          {/* Main content */}
          <main className="main flex-1 px-4 py-8 relative z-10 max-w-7xl mx-auto w-full">{children}</main>

          {/* Footer */}
          <footer className="glass-effect dreamy-glow m-4 rounded-3xl backdrop-blur-xl border-2 border-purple-500/30 relative z-10">
            <div className="px-8 py-6 text-center">
              <div className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-sm font-semibold mb-2">
                © 2026 UMich Q&A Hub
              </div>
              <div className="text-purple-200/60 text-sm">
                Built with ❤️ for UMich Community
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
