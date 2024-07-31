import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
	const id = cookies().get("userId");
	const passkeys = await fetch(`${process.env.API_URL}/passkey`)
		.then((result) => result.json())
		.then((result) => result.filter((key) => key.userId === id?.value));
	return NextResponse.json({ passkeys });
};
