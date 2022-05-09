import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
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
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <List header="Exercises">
        {exercises.map((exercise) => (
          <List.Item key={exercise.creationTime}>
            <Text style={{
              fontWeight: 'bold',
              fontSize: 20,
              margin: 50,
              color: 'black',
            }}
            >
              {`${exercise.name} - ${exercise.sets}x${exercise.reps} - Assigned by ${exercise.pt.username}`}
            </Text>
            <Text style={{ margin: 50, color: 'black' }}>
              {exercise.instructions}
            </Text>
            <Stepper
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
    </View>
  );
}

export default ExerciseScreen;
