import React, { useState } from 'react';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ margin: 50 }}>
        Profile
      </Text>
    </View>
  );
}