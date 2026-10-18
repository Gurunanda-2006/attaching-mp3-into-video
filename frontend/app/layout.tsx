import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Telugu Cut", description: "Add Telugu music to product videos" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
