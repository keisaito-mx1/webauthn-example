"use client";

import { type SubmitHandler, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { authenticatePassKey } from "@/lib/webauthn/sdk";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export default function Home() {
	const router = useRouter();
	const { toast } = useToast();
	type FieldValue = { id: string; password: string };

	const { register, handleSubmit } = useForm<FieldValue>({
		defaultValues: {
			id: "admin",
			password: "admin",
		},
	});
	const onSubmit: SubmitHandler<FieldValue> = async (data) => {
		const result = await fetch("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({
				userId: data.id,
				password: data.password,
			}),
		});

		if (result.ok) {
			return router.push("/home");
		}

		toast({
			variant: "destructive",
			title: "ログインに失敗しました。",
		});
	};
	return (
		<main>
			<Card className="p-4">
				<CardHeader>
					<CardTitle className="text-sm font-semibold">ログイン</CardTitle>
					<CardDescription>
						ログインしてパスキーを登録してください。(id:admin pass:admin)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="grid gap-2">
						<div className="grid gap-1">
							<label htmlFor="id">ID</label>
							<Input {...register("id")} type="text" placeholder="ID" />
						</div>
						<div className="grid gap-1">
							<label htmlFor="id">パスワード</label>
							<Input
								{...register("password")}
								type="password"
								placeholder="password"
								id="password"
							/>
						</div>
						<Button variant={"default"} type="submit">
							ログイン
						</Button>
					</form>
					<Separator orientation="horizontal" className="h-3" />
					<Button
						className="w-full"
						variant={"outline"}
						onClick={async () => {
							const result = await authenticatePassKey();
							if (result.isErr()) {
								return toast({
									title: "パスキーによるログインに失敗しました。",
									variant: "destructive",
								});
							}

							return router.push("/home");
						}}
					>
						パスキーを使ってログイン
					</Button>
				</CardContent>
			</Card>
		</main>
	);
}
