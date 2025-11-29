import type {Metadata} from "next";
import {Geist, Geist_Mono, Source_Code_Pro, Tomorrow} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
const sourceCodePro = Source_Code_Pro({
    variable: "--font-source-code-pro",
    subsets: ["latin"],
});
const tomorrow = Tomorrow({
    variable: "--font-tomorrow",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Better AI",
    description: "chat bot which is better than others as alexa features and is good for education",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${tomorrow.variable} ${sourceCodePro.variable}  antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
