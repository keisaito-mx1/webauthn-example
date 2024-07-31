import { generateAuthenticationOptions } from "@simplewebauthn/server";
import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/types";
import { NextResponse } from "next/server";

export const GET = async () => {
	const options: PublicKeyCredentialRequestOptionsJSON =
		await generateAuthenticationOptions({
			allowCredentials: [], //認証できる端末を制限する場合はここにcredentialIdを指定する
			timeout: 60000,
			userVerification: "preferred",
			extensions: undefined,
			rpID: process.env.DOMAIN as string,
		});
	return NextResponse.json(options);
};
