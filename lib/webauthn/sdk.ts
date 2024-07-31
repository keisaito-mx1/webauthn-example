import {
	startAuthentication,
	startRegistration,
} from "@simplewebauthn/browser";
import type { VerifiedAuthenticationResponse } from "@simplewebauthn/server";
import type {
	PublicKeyCredentialCreationOptionsJSON,
	PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { err, fromPromise } from "neverthrow";

export const registerPassKey = async () => {
	/**
	 * @see app/api/webauthn/attestation/options/route.ts
	 */
	const options: PublicKeyCredentialCreationOptionsJSON = await fetch(
		"/api/webauthn/attestation/options",
	).then((result) => result.json());

	// Navigate.credentials.createをラップしたSimpleWebAuthnのパッケージを使用して登録処理を行う
	const att = await fromPromise(startRegistration(options), (e) => e as Error);
	if (att.isErr()) {
		return err(att.error);
	}

	const result: PublicKeyCredentialRequestOptionsJSON = await fetch(
		"/api/webauthn/attestation/result",
		{
			method: "POST",
			body: JSON.stringify(att.value),
			headers: {
				Challenge: options.challenge,
			},
		},
	).then((result) => result.json());

	return att.map(() => result);
};

export const authenticatePassKey = async () => {
	/**
	 * @see app/api/webauthn/assertion/options/route.ts
	 */
	const options: PublicKeyCredentialRequestOptionsJSON = await fetch(
		"/api/webauthn/assertion/options",
	).then((result) => result.json());

	// Navigate.credentials.getをラップしたSimpleWebAuthnのパッケージを使用して認証処理を行う
	const assert = await fromPromise(
		startAuthentication(options),
		(e) => e as Error,
	);
	if (assert.isErr()) {
		return err(assert.error);
	}
	const response = await fetch("/api/webauthn/assertion/result", {
		method: "POST",
		body: JSON.stringify({
			credentialId: assert.value.id,
			verification: assert.value,
		}),
		headers: {
			Challenge: options.challenge,
		},
	});

	if (response.ok === false) {
		return err(new Error("Verification failed"));
	}

	const result = await response.json();

	return assert.map(() => result as VerifiedAuthenticationResponse);
};
