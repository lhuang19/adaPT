import React, { useState, useEffect } from 'react';
import { List, Stepper } from '@ant-design/react-native';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from '@env';

const baseUrl = `${BASE_URL}/api`;

function ExerciseScreen({ userData }) {
  const [exercises, setExercises] = useState([]);
  const { username } = userData;

  async function fetchNewExercises() {
    try {
      const res = await axios.get(`${baseUrl}/exercise/feed/${username}`);
      setExercises(res.data.data);
    } catch (error) {
      alert(error);
    }
  }
  useEffect(() => {
    if (username !== undefined) fetchNewExercises();
  }, [username]);

  return (
    <List style={{ paddingTop: 30 }} header="Exercises">
      {exercises.map((exercise) => (
        <List.Item style={{ padding: 20, textAlign: 'center', fontWeight: 'bold' }} key={exercise.creationTime} multipleLine wrap>
          {`${exercise.name} - ${exercise.sets}x${exercise.reps} - Assigned by ${exercise.pt.username}`}

          {exercise.instructions}
          <Stepper
            style={{ padding: 30 }}
            min={0}
            max={exercise.sets}
            defaultValue={exercise.setsCompleted}
            onChange={async (value) => {
              const json = JSON.stringify({
                patient: exercise.patient,
                creationTime: exercise.creationTime,
                setsCompleted: value,
              });
              try {
                await axios.put(`${baseUrl}/exercise/counter`, json, {
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
              } catch (error) {
                alert(error);
              }
            }}
          />
        </List.Item>
      ))}
    </List>
  );
}

export default ExerciseScreen;