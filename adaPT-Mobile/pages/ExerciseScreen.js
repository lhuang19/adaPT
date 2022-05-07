import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { List } from 'antd-mobile';
// eslint-disable-next-line import/no-relative-packages
import { doAPIRequest } from '../../frontend/src/modules/api';

import Exercise from '../components/Exercise';

function ExerciseScreen({ userData }) {
  const [exercises, setExercises] = useState([]);
  const { username } = userData;

  async function fetchNewExercises() {
    const { data } = await doAPIRequest('/exercise/feed', {
      method: 'POST',
      body: { username },
    });
    setExercises(data);
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
