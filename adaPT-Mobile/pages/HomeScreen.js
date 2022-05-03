import React from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen({ userData }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ margin: 50 }}>
        {`Hello, ${userData.firstname} ${userData.lastname}`}
      </Text>
    </View>
  );
}
