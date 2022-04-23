import React, { useContext } from "react";
import { Collapse } from "antd";
import { InfoCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";
import { AuthUserContext } from "../../context/Auth";

const { Panel } = Collapse;

const uncompletedIcon = <InfoCircleOutlined />;
const completedIcon = <CheckCircleTwoTone twoToneColor="00ff00" />;

function Exercise(props) {
  const { data } = props;
  const { name, sets, reps, instructions, setsCompleted, patient, pt } = data;
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
      <Collapse
        defaultActiveKey={setsCompleted === sets ? [] : ["1"]}
        // eslint-disable-next-line react/no-unstable-nested-components
        expandIcon={({ isActive }) =>
          isActive ? uncompletedIcon : completedIcon
        }
        // onChange={() => completeExercise(data.time)}
      >
        <Panel
          header={`${name} - ${sets}x${reps} - Assigned ${
            role === "PT" ? "to ".concat(patient) : "by ".concat(pt)
          }`}
          key="1"
        >
          <p>{instructions}</p>
        </Panel>
      </Collapse>
    </div>
  );
}

export default Exercise;
