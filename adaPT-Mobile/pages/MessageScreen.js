import React from 'react';
import { Text, View } from 'react-native';

export default function MessageScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ margin: 50 }}>
        Message
      </Text>
    </View>
  );
}
