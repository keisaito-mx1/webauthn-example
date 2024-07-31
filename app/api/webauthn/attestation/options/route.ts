import { generateRegistrationOptions } from "@simplewebauthn/server";
import { isoUint8Array } from "@simplewebauthn/server/helpers";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/types";

export const GET = async () => {
	const id = cookies().get("userId");
	if (id === undefined) {
		return NextResponse.json({ status: 400, error: "エラー" });
	}

	const exitsPasskeys = await fetch(`${process.env.API_URL}/passkey`)
		.then((result) => result.json())
		.then((result) => result.filter((key) => key.userId === id.value));

	const options: PublicKeyCredentialCreationOptionsJSON =
		await generateRegistrationOptions({
			rpName: process.env.DOMAIN as string,
			rpID: process.env.DOMAIN as string,
			userID: isoUint8Array.fromUTF8String(id.value),
			userName: id.value,
			userDisplayName: id.value,
			attestationType: "none",
			excludeCredentials: exitsPasskeys.map((key) => ({
				id: key.credentialId,
			})),
			timeout: 60000,
			authenticatorSelection: {
				residentKey: "required", /// 認証キーにcredentialIdを保存する
				userVerification: "preferred",
				authenticatorAttachment: undefined,
			},
		});

	return NextResponse.json(options);
};
