import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import type { AuthenticationResponseJSON } from "@simplewebauthn/types";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
	const json = await req.json();
	const challenge = req.headers.get("Challenge");
	const verification: AuthenticationResponseJSON = json.verification;
	const credentialId = json.credentialId;

	if (challenge === null) {
		return NextResponse.json(
			{ error: "Challenge is Required" },
			{ status: 400 },
		);
	}

	const response = await fetch(
		`${process.env.API_URL}/passkey/${credentialId}`,
	);

	if (response.ok === false) {
		return NextResponse.json({ error: "Passkey is Invalid" }, { status: 400 });
	}

	const passkey = await response.json();

	const { verified, authenticationInfo } = await verifyAuthenticationResponse({
		response: verification,
		expectedChallenge: challenge,
		expectedOrigin: new URL(req.url).origin, ///
		expectedRPID: process.env.DOMAIN as string,
		requireUserVerification: false,
		authenticator: {
			credentialID: passkey.credentialId,
			counter: passkey.counter,
			credentialPublicKey: new Uint8Array(
				Buffer.from(passkey.credentialPublicKey, "base64"),
			),
		},
	});

	if (verified === false) {
		return NextResponse.json({ error: "Verified is Failed" }, { status: 400 });
	}

	cookies().set("userId", passkey.userId); // 認証通過したら

	return NextResponse.json(authenticationInfo);
};
