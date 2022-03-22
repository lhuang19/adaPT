import React, { useContext } from "react";
import { AuthUserContext } from "../../context/Auth";

function Home() {
  const { credentials } = useContext(AuthUserContext);
  console.log(credentials);
  return (
    <div>
      <h1>Home</h1>
      <p>{credentials.user}</p>
    </div>
  );
}

export default Home;
