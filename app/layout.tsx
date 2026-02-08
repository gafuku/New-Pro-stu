import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "College Q&A Hub",
  description: "Questions, answers, and resources for College prospects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Header />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
