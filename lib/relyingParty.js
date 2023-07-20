"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegistration = exports.generateRegistrationOptions = void 0;
var server_1 = require("@simplewebauthn/server");
// Human-readable title for your website
var RP_NAME = "Firepot Web3account";
// A unique identifier for your website
var RP_ID = "localhost";
// The URL at which registrations and authentications should occur
var ORIGIN = "https://".concat(RP_ID);
function generateRegistrationOptions(username) {
    var userId = getUserId(username) || setUserId(username);
    var userAuthenticators = getUserAuthenticators(userId);
    var options = (0, server_1.generateRegistrationOptions)({
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: userId,
        userName: username,
        timeout: 60000,
        attestationType: "none",
        authenticatorSelection: {
            residentKey: "required",
            userVerification: "preferred",
        },
        excludeCredentials: userAuthenticators.map(function (authenticator) { return ({
            id: base64ToBytes(authenticator.credentialIdBase64),
            type: "public-key",
        }); }),
    });
    setCurrentUserChallenge(userId, options.challenge);
    return options;
}
exports.generateRegistrationOptions = generateRegistrationOptions;
function verifyRegistration(username, response) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, expectedChallenge, verification, error_1, verified, registrationInfo, credentialPublicKey, credentialID, counter, credentialDeviceType, credentialBackedUp, authenticator;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userId = getUserId(username);
                    if (userId == null) {
                        throw new Error("User (".concat(username, ") not found"));
                    }
                    expectedChallenge = getCurrentUserChallenge(userId);
                    if (expectedChallenge == null) {
                        throw new Error("Challenge not found for user (".concat(username, ")"));
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, server_1.verifyRegistrationResponse)({
                            response: response,
                            expectedChallenge: expectedChallenge,
                            expectedOrigin: ORIGIN,
                            expectedRPID: RP_ID,
                        })];
                case 2:
                    verification = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    removeCurrentUserChallenge(userId);
                    throw error_1;
                case 4:
                    verified = verification.verified, registrationInfo = verification.registrationInfo;
                    if (registrationInfo == null) {
                        removeCurrentUserChallenge(userId);
                        throw new Error("Registration info not found");
                    }
                    credentialPublicKey = registrationInfo.credentialPublicKey, credentialID = registrationInfo.credentialID, counter = registrationInfo.counter, credentialDeviceType = registrationInfo.credentialDeviceType, credentialBackedUp = registrationInfo.credentialBackedUp;
                    if (credentialDeviceType !== "multiDevice" || credentialBackedUp !== true) {
                        removeCurrentUserChallenge(userId);
                        return [2 /*return*/, { verified: false, message: "Not a passkey" }];
                    }
                    authenticator = {
                        credentialIdBase64: bytesToBase64(credentialID),
                        credentialPublicKeyBase64: bytesToBase64(credentialPublicKey),
                        counter: counter,
                        credentialDeviceType: credentialDeviceType,
                        credentialBackedUp: credentialBackedUp,
                    };
                    setUserAuthenticator(userId, authenticator);
                    removeCurrentUserChallenge(userId);
                    return [2 /*return*/, { verified: verified }];
            }
        });
    });
}
exports.verifyRegistration = verifyRegistration;
function setUserId(username) {
    var userId = crypto.randomUUID();
    localStorage.setItem(username, userId);
    return userId;
}
function getUserId(username) {
    return localStorage.getItem(username);
}
function setCurrentUserChallenge(userId, challenge) {
    localStorage.setItem(userId + "-challenge", challenge);
}
function getCurrentUserChallenge(userId) {
    return localStorage.getItem(userId + "-challenge");
}
function removeCurrentUserChallenge(userId) {
    localStorage.removeItem(userId + "-challenge");
}
function setUserAuthenticator(userId, authenticator) {
    var authenticators = getUserAuthenticators(userId);
    authenticators.push(authenticator);
    localStorage.setItem(userId, JSON.stringify(authenticators));
}
function getUserAuthenticators(userId) {
    var authenticatorsJson = localStorage.getItem(userId);
    return authenticatorsJson ? JSON.parse(authenticatorsJson) : [];
}
function base64ToBytes(base64) {
    var binString = atob(base64);
    return Uint8Array.from(binString, function (m) { return m.codePointAt(0); });
}
function bytesToBase64(bytes) {
    var binString = Array.from(bytes, function (x) {
        return String.fromCodePoint(x);
    }).join("");
    return btoa(binString);
}
