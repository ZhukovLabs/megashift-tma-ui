import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import {SafeContentArea} from "@/components/safe-content-area";
import {I18nProvider} from "@/i18n/provider";
import {getLocale} from "@/i18n/locale";

import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

import {QueryClientProvider} from "@tanstack/react-query";
import {queryClient} from "@/lib/react-query";
import {ToastContainer} from "react-toastify";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Next Telegram Mini App",
    description: "Telegram Mini App built",
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const locale = await getLocale();

    return (
        <html lang={locale}>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryClientProvider client={queryClient}>
            <I18nProvider>
                <SafeContentArea>
                    {children}
                    <ToastContainer
                        position="bottom-center"
                        autoClose={4000}
                        hideProgressBar={false}
                        newestOnTop={true}
                        closeOnClick={true}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        style={{
                            maxWidth: '100vw',
                            padding: '0 8px 32px 8px',
                            fontSize: '16px',
                            borderRadius: '12px'
                        }}
                    />
                </SafeContentArea>
            </I18nProvider>
        </QueryClientProvider>
        </body>
        </html>
    );
}
