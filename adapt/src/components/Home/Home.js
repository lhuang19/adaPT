import React, { useContext } from "react";
import { AuthUserContext } from "../../context/Auth";

function Home() {
  const { credentials } = useContext(AuthUserContext);
  return (
    <div>
      <h1>Home</h1>
      <p>{credentials.username}</p>
    </div>
  );
}

export default Home;
