import React, { useState, useEffect } from "react";
import { List } from "antd";
import { Parallax } from "rc-scroll-anim";

import { doAPIRequest } from "../../modules/api";
import Exercise from "./Exercise";

function Exercises({ name, animate }) {
  const [exercises, setExercises] = useState([]);

  async function fetchNewExercises() {
    const { data } = await doAPIRequest(`/exercise/feed/${name}`, {
      method: "GET",
    });
    setExercises(data);
  }
  useEffect(() => {
    if (name !== undefined) fetchNewExercises();
  }, [name]);
  return (
    <List
      dataSource={exercises}
      renderItem={(exercise) => (
        <List.Item key={exercise.creationTime}>
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
              <Exercise
                data={exercise}
                animate
                fetchNewExercises={() => fetchNewExercises()}
              />
            </Parallax>
          ) : (
            <Exercise
              data={exercise}
              fetchNewExercises={() => fetchNewExercises()}
            />
          )}
        </List.Item>
      )}
    />
  );
}

export default Exercises;
