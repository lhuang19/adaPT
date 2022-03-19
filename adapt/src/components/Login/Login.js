import React, { useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthUserContext } from "../../context/Auth";
import { loginRequest } from "../../modules/storage";

function Login() {
  const { setCredentials } = useContext(AuthUserContext);
  const navigate = useNavigate();
  const loginInput = useRef("");

  async function loginHandler(input) {
    const { success, error } = await loginRequest(input);
    if (success) {
      setCredentials({ user: input });
      navigate("/");
    } else {
      alert(error);
    }
  }
  function onInputHandler(event) {
    loginInput.current = event.target.value;
  }
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => loginHandler(loginInput.current)} type="button">
        login
      </button>
      <input onChange={(input) => onInputHandler(input)} />
      <button onClick={() => navigate("/signup")} type="button">
        Create account
      </button>
    </div>
  );
}

export default Login;
