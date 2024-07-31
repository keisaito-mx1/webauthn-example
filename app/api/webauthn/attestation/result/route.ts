import parser from "ua-parser-js";
import { verifyRegistrationResponse } from "@simplewebauthn/server";
import type { RegistrationResponseJSON } from "@simplewebauthn/types";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = async (req: Request) => {
	const response: RegistrationResponseJSON = await req.json();
	const challenge = req.headers.get("Challenge");
	const ua = parser(req.headers.get("user-agent") as string);

	if (challenge === null) {
		return NextResponse.json({ status: 400, error: "Challenge" });
	}

	const origin = new URL(req.url).origin;

	const userId = cookies().get("userId")?.value;

	const { verified, registrationInfo } = await verifyRegistrationResponse({
		response: response,
		expectedChallenge: challenge,
		expectedOrigin: origin,
		expectedRPID: process.env.DOMAIN,
		requireUserVerification: true,
	});

	if (verified === false) {
		return NextResponse.json({ error: "Verification failed" }, { status: 400 });
	}

	if (registrationInfo === undefined) {
		return NextResponse.json({ error: "Verification failed" }, { status: 400 });
	}

	const browserNameOrDeviceType = ua.browser.name ?? ua.device.type;

	const passKey = {
		id: registrationInfo.credentialID,
		credentialId: registrationInfo.credentialID,
		credentialPublicKey: Buffer.from(
			registrationInfo.credentialPublicKey,
		).toString("base64"),
		counter: registrationInfo.counter, // 認証回数
		name: `${ua.os.name}の${browserNameOrDeviceType}`.trim(),
		credentialDeviceType: registrationInfo.credentialDeviceType,
		credentialBackedUp: registrationInfo.credentialBackedUp,
		userId: userId ?? "",
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	await fetch(`${process.env.API_URL}/passkey`, {
		method: "POST",
		body: JSON.stringify(passKey),
	});

	return NextResponse.json(registrationInfo);
};
