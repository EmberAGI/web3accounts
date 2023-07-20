import registerUser from "../../../src";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Web3Accounts</h1>
    <h2>by Firepot</h2>
    <div">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      <br>
      <button id="register" type="button">Register</button>
    </div>
    <div id="success" />
    <div id="error" />
  </div>
`;

// <button>
const elemBegin = document.getElementById("register");
// <span>/<p>/etc...
const elemSuccess = document.getElementById("success");
// <span>/<p>/etc...
const elemError = document.getElementById("error");
const elemUsername = document.querySelectorAll("input")[0];

elemBegin?.addEventListener("click", async () => {
  // Reset success/error messages
  elemSuccess!.innerHTML = "";
  elemError!.innerHTML = "";

  try {
    // Pass the options to the authenticator and wait for a response
    await registerUser(elemUsername.value);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Some basic error handling
    if (error.name === "InvalidStateError") {
      elemError!.innerText =
        "Error: Authenticator was probably already registered by user";
    } else {
      elemError!.innerText = error;
    }

    throw error;
  }

  elemSuccess!.innerHTML = "Success!";
});
