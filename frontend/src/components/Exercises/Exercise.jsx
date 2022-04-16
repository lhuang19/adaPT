import React from "react";
import { Collapse } from "antd";
import { InfoCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";

const { Panel } = Collapse;

function Exercise(props) {
  console.log("Creating exercise");
  const { data } = props;
  const { name, sets, reps, instructions, setsCompleted } = data;
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
        expandIcon={({ isActive }) =>
          isActive ? (
            <InfoCircleOutlined />
          ) : (
            <CheckCircleTwoTone twoToneColor="00ff00" />
          )
        }
        // onChange={() => completeExercise(data.time)}
      >
        <Panel header={`${name}-${sets}x${reps}`} key="1">
          <p>{instructions}</p>
        </Panel>
      </Collapse>
    </div>
  );
}

export default Exercise;
