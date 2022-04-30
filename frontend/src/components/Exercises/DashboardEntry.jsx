import React from "react";
import { Avatar } from "antd";

import { Parallax } from "rc-scroll-anim";

function DashboardEntry(props) {
  const { data, animate } = props;
  const { patient, setsCompleted, totalSets } = data;
  const { username, firstname, lastname } = patient;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          paddingBottom: "1vw",
        }}
      >
        {animate ? (
          <Parallax
            animation={[
              { x: 20, opacity: 1, playScale: [0, 0.2] },
              { x: 0, opacity: 1, playScale: [0, 0.1] },
            ]}
            style={{
              transform: "translateX(-100px)",
              opacity: 0,
            }}
            className="code-box-shape"
          >
            <Avatar size={64} src={`https://joeschmoe.io/api/v1/${username}`} />
          </Parallax>
        ) : (
          <Avatar size={64} src={`https://joeschmoe.io/api/v1/${username}`} />
        )}
        {animate ? (
          <Parallax
            animation={[
              { x: -20, opacity: 1, playScale: [0, 0.2] },
              { x: 0, opacity: 1, playScale: [0, 0.1] },
            ]}
            style={{
              transform: "translateX(100px)",
              opacity: 0,
            }}
            className="code-box-shape"
          >
            <div
              style={{
                paddingLeft: "1vw",
              }}
            >
              <h2>
                <b>
                  {firstname} {lastname}
                </b>

                <span style={{ fontSize: "10px", color: "grey" }}>
                  &emsp;{username}
                </span>
              </h2>
            </div>
          </Parallax>
        ) : (
          <div
            style={{
              paddingLeft: "1vw",
            }}
          >
            <h2>{username} </h2>
          </div>
        )}
      </div>
      <ul>
        <li>Total Sets Completed: {setsCompleted}</li>
        <li>Total Sets Assigned: {totalSets}</li>
        <li>Completion Rate: {setsCompleted / totalSets}</li>
      </ul>
    </div>
  );
}

export default DashboardEntry;
