import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
	const json = await req.json();

	const userOrNull = await fetch(`${process.env.API_URL}/users/${json.userId}`)
		.then((result) => result.json())
		.catch(() => null);

	if (userOrNull === null) {
		return NextResponse.json({ error: "" }, { status: 400 });
	}

	const user = userOrNull;
	const verified = user.password === json.password;

	if (verified) {
		cookies().set("userId", user.id);
		return NextResponse.json(
			{ error: "ログインに失敗しました。" },
			{ status: 200 },
		);
	}

	return NextResponse.json({ error: "" }, { status: 400 });
};
