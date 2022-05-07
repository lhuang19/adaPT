import React from 'react';
import { View, Text } from 'react-native';
import { Rate } from 'antd-mobile';
import { CheckCircleOutline } from 'antd-mobile-icons';

// eslint-disable-next-line import/no-relative-packages
import { doAPIRequest } from '../../frontend/src/modules/api';

const setCompletionIcon = <CheckCircleOutline />;

function Exercise({ data }) {
  const {
    name,
    sets,
    reps,
    instructions,
    setsCompleted,
    patient,
    pt,
    creationTime,
  } = data;

  return (
    <View
      style={{
        position: 'relative',
        width: '100%',
        padding: '20px',
      }}
    >
      <Text style={{ fontWeight: 'bold' }}>
        {`${name} - ${sets}x${reps} - Assigned by ${pt.username}`}
      </Text>
      <Text style={{ whiteSpace: 'pre-wrap' }}>{instructions}</Text>
      <Rate
        character={setCompletionIcon}
        count={sets}
        defaultValue={setsCompleted}
        onChange={async (value) => {
          await doAPIRequest('/exercise/counter', {
            method: 'POST',
            body: { patient, creationTime, setsCompleted: value },
          });
        }}
      />
    </View>
  );
}

export default Exercise;
