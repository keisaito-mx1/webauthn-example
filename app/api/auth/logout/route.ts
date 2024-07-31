import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
	cookies().delete("userId");
	return NextResponse.json({}, { status: 200 });
};
