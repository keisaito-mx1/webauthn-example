import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
	const userId = cookies().get("userId");

	if (userId === undefined) {
		return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
	}

	return NextResponse.json(
		{
			userId: userId.value,
		},
		{ status: 200 },
	);
};
