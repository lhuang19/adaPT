import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { List } from 'antd-mobile';
import axios from 'axios';

import Exercise from '../components/Exercise';

const baseUrl = 'http://10.102.196.128:8000';

function ExerciseScreen({ userData }) {
  const [exercises, setExercises] = useState([]);
  const { username } = userData;

  async function fetchNewExercises() {
    const res = await axios.post(`${baseUrl}/exercise/feed`)
      .catch((error) => {
        alert(error);
      });
    setExercises(res.data.data);
  }
  useEffect(() => {
    if (username !== undefined) fetchNewExercises();
  }, [username]);

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <List header="Exercises">
        {exercises.map((exercise) => (
          <List.Item key={exercise.creationTime}>
            <Exercise
              data={exercise}
            />
          </List.Item>
        ))}
      </List>
    </View>
  );
}

export default ExerciseScreen;
