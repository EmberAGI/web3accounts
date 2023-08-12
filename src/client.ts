import {
  startAuthentication,
  startRegistration,
  browserSupportsWebAuthn,
  platformAuthenticatorIsAvailable,
  browserSupportsWebAuthnAutofill,
} from "@simplewebauthn/browser";
import {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/typescript-types";
import W3aError from "./lib/w3aError";

interface WebAuthnSupport {
  supported: boolean;
  features: {
    platformAuthenticator: boolean;
    conditionalMediation: boolean;
  };
}

const HOST = "localhost";

export async function webAuthnSupport(): Promise<WebAuthnSupport> {
  return {
    supported: browserSupportsWebAuthn(),
    features: {
      platformAuthenticator: await platformAuthenticatorIsAvailable(),
      conditionalMediation: await browserSupportsWebAuthnAutofill(),
    },
  };
}

export async function registerAccount(username: string) {
  const optionsRes = await fetch(
    `http://${HOST}:3000/registration/options/${username}`,
  );
  const options = await optionsRes.json();

  let attestationResponse: RegistrationResponseJSON;
  try {
    attestationResponse = await startRegistration(options);
  } catch (error) {
    console.error(error);
    throw error;
  }

  try {
    const bodyJson = JSON.stringify({
      attestationResponse,
    });
    console.log(`Body JSON: ${bodyJson}`);
    await fetch(`http://${HOST}:3000/registration/${username}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyJson,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function discoverCredentials() {
  const optionsRes = await fetch(`http://${HOST}:3000/authentication/options`, {
    credentials: "include",
  });
  const options =
    (await optionsRes.json()) as PublicKeyCredentialRequestOptionsJSON;
  console.log(`Options: ${JSON.stringify(options)}`);
  return await startAuthentication(options, true);
}

export async function logIn(
  username: string,
  assertionResponse?: AuthenticationResponseJSON,
) {
  if (!assertionResponse) {
    const optionsRes = await fetch(
      `http://${HOST}:3000/authentication/options/${username}`,
      {
        credentials: "include",
      },
    );
    const options =
      (await optionsRes.json()) as PublicKeyCredentialRequestOptionsJSON;
    assertionResponse = await startAuthentication(options);
  }

  try {
    const bodyJson = JSON.stringify({ assertionResponse });
    console.log(`Body JSON: ${bodyJson}`);
    await fetch(`http://${HOST}:3000/authentication/session`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyJson,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function logOut() {
  await fetch(`http://${HOST}:3000/authentication/session`, {
    method: "DELETE",
    credentials: "include",
  });
}

export async function getSession() {
  const sessionRes = await fetch(`http://${HOST}:3000/authentication/session`, {
    credentials: "include",
  });
  const session = await sessionRes.json();
  return session;
}
