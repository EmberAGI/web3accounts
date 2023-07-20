import { RegistrationResponseJSON } from "@simplewebauthn/typescript-types";
export declare function generateRegistrationOptions(username: string): import("@simplewebauthn/typescript-types").PublicKeyCredentialCreationOptionsJSON;
export declare function verifyRegistration(username: string, response: RegistrationResponseJSON): Promise<{
    verified: boolean;
    message: string;
} | {
    verified: boolean;
    message?: undefined;
}>;
