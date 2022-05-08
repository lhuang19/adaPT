import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { List } from 'antd-mobile';
import axios from 'axios';
// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from '@env';

import Exercise from '../components/Exercise';

const baseUrl = `${BASE_URL}/api`;

function ExerciseScreen({ userData }) {
  const [exercises, setExercises] = useState([]);
  const { username } = userData;

  async function fetchNewExercises() {
    const res = await axios.get(`${baseUrl}/exercise/feed/${username}`)
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
