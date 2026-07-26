import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Сергей Лапин — персональный матч-центр",
  description: "Матчи, форма, команды и рекорды Сергея Лапина.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
