"use client";

import { useEffect, useState } from "react";

export default function LoginUserCard() {
	const [session, setSession] = useState<{ userId: string }>();
	useEffect(() => {
		fetch("/api/auth/session")
			.then((result) => result.json())
			.then((result) => setSession(result));
	}, []);

	return session?.userId ? (
		<p>{session?.userId}でログインしています。cookie認証</p>
	) : (
		<p>ログインしていません。</p>
	);
}
