import type { Metadata } from "next";
import LoginUserCard from "./_components/login-user-card";

export const metadata: Metadata = {
	title: "WetAuthnExample",
};

export default function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="max-w-5xl mx-auto">{children}</div>;
}
