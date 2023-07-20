import { startRegistration } from "@simplewebauthn/browser";
import {
  generateRegistrationOptions,
  verifyRegistration,
} from "./relyingParty";

export default async function registerUser(username: string) {
  const options = await generateRegistrationOptions(username);

  let registration;
  try {
    registration = await startRegistration(options);
  } catch (error) {
    console.error(error);
    throw error;
  }

  let verificationResponse;
  try {
    verificationResponse = await verifyRegistration(username, registration);

    if (!verificationResponse.verified) {
      console.warn(verificationResponse.verified);
      throw new Error("Registration failed verification");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }

  console.log("Registration successful");
}
