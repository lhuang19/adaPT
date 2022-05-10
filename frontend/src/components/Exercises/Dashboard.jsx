import React, { useState, useEffect } from "react";
import { List } from "antd";
import { Parallax } from "rc-scroll-anim";

import { doAPIRequest } from "../../modules/api";
import DashboardEntry from "./DashboardEntry";

function Dashboard({ name, animate }) {
  const [patients, setPatients] = useState([]);
  const [, render] = useState(0);

  async function fetchNewPatients() {
    const { data } = await doAPIRequest(`/exercise/feed/${name}`, {
      method: "GET",
    });
    for (let i = 0; i < data.length; i += 1) {
      const { patient } = data[i];
      let index = -1;
      for (let j = 0; j < patients.length; j += 1) {
        if (patients[j].patient.username === patient.username) {
          index = j;
        }
      }
      if (index === -1) {
        patients.push({
          patient,
          setsCompleted: data[i].setsCompleted,
          totalSets: data[i].sets,
        });
      } else {
        patients[index].setsCompleted += data[i].setsCompleted;
        patients[index].totalSets += data[i].sets;
      }
    }
    setPatients(patients);
    render(1);
  }

  useEffect(() => {
    if (name !== undefined) fetchNewPatients();
  }, [name]);

  return (
    <List
      dataSource={patients}
      renderItem={(patient) => (
        <List.Item key={`${patient.patient.username}`}>
          {animate ? (
            <Parallax
              animation={[
                { y: 0, opacity: 1, scale: 1, playScale: [-0.3, 0.5] },
                {
                  translateY: -100,
                  opacity: 0,
                  scale: 0,
                  playScale: [0.4, 0.9],
                },
              ]}
              style={{
                transform: "translateY(100px) scale(0)",
                opacity: 0,
                width: "100%",
              }}
            >
              <DashboardEntry data={patient} animate />
            </Parallax>
          ) : (
            <DashboardEntry data={patient} />
          )}
        </List.Item>
      )}
    />
  );
}

export default Dashboard;
