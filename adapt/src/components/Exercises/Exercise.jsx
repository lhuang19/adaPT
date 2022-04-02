import React from "react";
import { Collapse } from "antd";
import { InfoCircleOutlined, CheckCircleTwoTone } from "@ant-design/icons";

import { completeExercise } from "../../modules/storage";

const { Panel } = Collapse;

function Exercise(props) {
  const { data } = props;
  const { name, reps, instructions } = data;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        padding: "20px",
      }}
    >
      <Collapse
        defaultActiveKey={data.completed ? [] : ["1"]}
        expandIcon={({ isActive }) =>
          isActive ? (
            <InfoCircleOutlined />
          ) : (
            <CheckCircleTwoTone twoToneColor="00ff00" />
          )
        }
        onChange={() => completeExercise(data.time)}
      >
        <Panel header={`${name}-${reps}`} key="1">
          <p>{instructions}</p>
        </Panel>
      </Collapse>
    </div>
  );
}

export default Exercise;
