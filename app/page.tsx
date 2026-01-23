"use client";

import dynamic from "next/dynamic";

const Welcome = dynamic(
    () => import("@/components/welcome").then(m => m.Welcome),
    { ssr: false }
);

export default function WelcomeClient() {
    return <Welcome />;
}
