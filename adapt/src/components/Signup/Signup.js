import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../../context/Auth";
import { signupRequest } from "../../modules/storage";

function Signup() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const signupInput = useRef("");
  async function signupHanlder(input) {
    const { success, error } = await signupRequest(input);
    if (success) {
      setCredentials({ user: input });
      navigate("/");
    } else {
      alert(error);
    }
  }
  function onInputHandler(event) {
    signupInput.current = event.target.value;
  }
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signupHanlder(signupInput.current)} type="button">
        Signup
      </button>
      <input onChange={(input) => onInputHandler(input)} type="button" />
    </div>
  );
}

export default Signup;
