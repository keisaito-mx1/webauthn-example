"use client";
import dayjs from "dayjs";
import { toast } from "@/components/ui/use-toast";
import { registerPassKey } from "../../lib/webauthn/sdk";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import LoginUserCard from "./_components/login-user-card";

type PassKeyEntity = {
	id: string;
	credentialId: string;
	credentialPublicKey: string;
	counter: number;
	name: string;
	credentialDeviceType: "singleDevice" | "multiDevice";
	credentialBackedUp: boolean;
	userId: string;
	createdAt: string; // ISO 8601 formatted date
	updatedAt: string; // ISO 8601 formatted date
};

export default function Home() {
	const [passkeys, setPasskeys] = useState<{ passkeys: PassKeyEntity[] }>({
		passkeys: [],
	});
	const fetchPassKeys = async () => {
		fetch("api/webauthn/passkeys")
			.then((result) => result.json())
			.then((result) => setPasskeys(result));
	};

	const router = useRouter();

	const deletePassKey = async (id: string) => {
		const result = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/passkey/${id}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
				method: "DELETE",
			},
		);

		if (result.ok) {
			fetchPassKeys();
			return toast({ title: "削除しました。" });
		}
		toast({ title: "削除に失敗しました。", variant: "destructive" });
	};

	// @ts-ignore
	const list = passkeys.passkeys ?? [];
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchPassKeys();
	}, []);
	return (
		<main className="grid gap-4">
			<LoginUserCard />
			<div className="flex gap-2">
				<Button
					type="button"
					onClick={async () => {
						const result = await registerPassKey();
						if (result.isErr()) {
							return toast({
								title: "登録に失敗しました。",
								description: result.error.message,
								variant: "destructive",
							});
						}
						fetchPassKeys();
						return toast({ title: "登録しました。" });
					}}
				>
					パスキーを登録する
				</Button>
				<Button
					type="button"
					variant={"outline"}
					onClick={async () => {
						await fetch("api/auth/logout", {
							method: "POST",
						});
						toast({ title: "ログアウトしました。" });
						router.push("/");
					}}
				>
					ログアウト
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-muted-foreground">
						登録したパスキー
					</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-2">
					{list.length === 0 && (
						<p className="text-muted-foreground">
							登録したパスキーはありません。
						</p>
					)}

					{list.map((passkey) => {
						return (
							<div className="flex justify-between" key={passkey.id as string}>
								<div>
									<p className="text-muted-foreground">
										{passkey.name as string}
									</p>
									<p className="text-muted-foreground">
										作成日: {dayjs(passkey.createdAt).format("YYYY/MM/DD")}
									</p>
								</div>
								<Button
									variant={"destructive"}
									size={"sm"}
									onClick={async () => await deletePassKey(passkey.id)}
								>
									削除
								</Button>
							</div>
						);
					})}
				</CardContent>
			</Card>
			<pre>{JSON.stringify(passkeys, null, 2)}</pre>
		</main>
	);
}
