import { startRegistration } from "@simplewebauthn/browser";
import {
  generateRegistrationOptions,
  verifyRegistration,
} from "./relyingParty";

export async function registerUser(username: string) {
  const options = await generateRegistrationOptions(username);

  let registration;
  try {
    registration = await startRegistration(options);
  } catch (error) {
    console.error(error);
    throw error;
  }

  const verificationResponse = await verifyRegistration(username, registration);
  if (verificationResponse.verified) {
    console.log("Registration successful");
  } else {
    console.error(new Error("Registration failed varification"));
  }
}
