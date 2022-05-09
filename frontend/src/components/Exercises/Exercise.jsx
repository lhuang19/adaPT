import React, { useContext } from "react";
import { Button, Rate } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";
import { doAPIRequest } from "../../modules/api";

const setCompletionIcon = <CheckCircleOutlined />;

function Exercise(props) {
  const { data } = props;
  const { fetchNewExercises } = props;
  const {
    name,
    sets,
    reps,
    instructions,
    setsCompleted,
    patient,
    pt,
    creationTime,
  } = data;

  const { credentials } = useContext(AuthUserContext);
  const { role } = credentials;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        padding: "20px",
      }}
    >
      <h3>
        <b>{`${name} - ${sets}x${reps} - Assigned ${
          role === "PT"
            ? "to ".concat(patient.username)
            : "by ".concat(pt.username)
        }`}</b>
      </h3>
      <p style={{ whiteSpace: "pre-wrap" }}>{instructions}</p>
      {role === "PT" ? (
        <div style={{ position: "absolute", right: "10px", top: "10px" }}>
          <Button
            danger
            onClick={async () => {
              await doAPIRequest("/exercise", {
                method: "DELETE",
                body: { pt, creationTime },
              });
              fetchNewExercises();
            }}
          >
            Delete
          </Button>
        </div>
      ) : null}
      <Rate
        character={setCompletionIcon}
        count={sets}
        defaultValue={setsCompleted}
        onChange={async (value) => {
          await doAPIRequest("/exercise/counter", {
            method: "PUT",
            body: { patient, creationTime, setsCompleted: value },
          });
        }}
      />
    </div>
  );
}

export default Exercise;
