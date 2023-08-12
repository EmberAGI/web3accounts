import registerUser from "../../../src";
import {
  discoverCredentials,
  getSession,
  logIn,
  logOut,
  webAuthnSupport,
} from "../../../src/client";
import W3aError from "../../../src/lib/w3aError";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Web3Accounts</h1>
    <h2>by Firepot</h2>
    <div>
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" autocomplete="webauthn" required>
      <br>
      <button id="register" type="button">Register</button>
      <br>
      <button id="login" type="button">Log In</button>
      <br>
      <button id="logout" type="button">Log Out</button>
      <br>
      <button id="session" type="button">Session Status</button>
    </div>
    <div id="success" />
    <div id="error" />
  </div>
`;

const elemRegister = document.getElementById("register");
const elemLogin = document.getElementById("login");
const elemLogout = document.getElementById("logout");
const elemSession = document.getElementById("session");
const elemSuccess = document.getElementById("success");
const elemError = document.getElementById("error");
const elemUsername = document.querySelectorAll("input")[0];

elemRegister?.addEventListener("click", async () => {
  elemSuccess!.innerHTML = "";
  elemError!.innerHTML = "";

  try {
    await registerUser(elemUsername.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === "InvalidStateError") {
      elemError!.innerText =
        "Error: Authenticator was probably already registered by user";
    } else {
      elemError!.innerText = error;
    }
    return;
  }

  elemSuccess!.innerHTML = "Registration successful!";
});

elemLogin?.addEventListener("click", async () => {
  elemSuccess!.innerHTML = "";
  elemError!.innerHTML = "";

  try {
    await logIn(elemUsername.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    elemError!.innerText = error;
    return;
  }

  elemSuccess!.innerHTML = "Login successful!";
});

elemLogout?.addEventListener("click", async () => {
  elemSuccess!.innerHTML = "";
  elemError!.innerHTML = "";

  try {
    await logOut();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    elemError!.innerText = error;
    return;
  }

  elemSuccess!.innerHTML = "Logout successful!";
});

elemSession?.addEventListener("click", async () => {
  elemSuccess!.innerHTML = "";
  elemError!.innerHTML = "";

  try {
    const session = await getSession();
    elemSuccess!.innerHTML = JSON.stringify(session);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    elemError!.innerText = error;
    return;
  }
});

async function start() {
  try {
    const support = await webAuthnSupport();

    if (!support.supported) {
      throw new W3aError({
        type: "webauthn/not-supported",
        title: "WebAuthn not supported",
        detail:
          "This browser does not support WebAuthn on this device. Please try another browser or device.",
      });
    }

    if (!support.features.platformAuthenticator) {
      throw new W3aError({
        type: "webauthn/platform-authenticators/not-supported",
        title: "Platform authenticators not supported",
        detail:
          "This browser does not support platform authenticators on this device. Please try another browser or device.",
      });
    }

    if (support.features.conditionalMediation) {
      const assertion = await discoverCredentials();
      console.log(`Assertion: ${assertion}`);
      await logIn(elemUsername.value, assertion);
      elemSuccess!.innerHTML = "Login successful!";
    } else {
      const error = new W3aError({
        type: "webauthn/conditional-mediation/not-supported",
        title: "Conditional mediation not supported",
        detail:
          "This browser does not support conditional mediation (credential auto-fill) on this device. Please try another browser or device.",
      });
      console.warn(error);
    }
  } catch (error) {
    console.error(error);
  }
}

start();
