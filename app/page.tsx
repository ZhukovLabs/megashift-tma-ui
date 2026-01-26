"use client";

import dynamic from "next/dynamic";

const StartForm = dynamic(
    () => import("@/components/start-form").then(m => m.StartForm),
    { ssr: false }
);

export default function WelcomeClient() {
    return <StartForm />;
}
