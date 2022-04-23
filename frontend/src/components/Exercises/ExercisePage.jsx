import React, { useContext } from "react";

import { AuthUserContext } from "../../context/Auth";
import Exercises from "./Exercises";
import ExerciseModal from "./ExerciseModal";

function ExercisePage() {
  const { credentials } = useContext(AuthUserContext);
  const { username, role } = credentials;

  return (
    <div style={{ background: "white" }}>
      <div style={{ margin: "auto", display: "block", width: "80%" }}>
        {role === "PT" ? (
          <div>
            <Exercises name={username} animate />
            <ExerciseModal />
          </div>
        ) : (
          <Exercises name={username} animate />
        )}
        <div style={{ height: "150px" }} />
      </div>
    </div>
  );
}

export default ExercisePage;
