import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "StreamVault (Arc)",
  description: "Create streams, fund them, and let payees claim in real time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gradient-to-br from-indigo-50 via-white to-rose-50 text-slate-900 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
