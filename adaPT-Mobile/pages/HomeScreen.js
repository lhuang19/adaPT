import React from 'react';
import { SafeAreaView } from 'react-native';
import { Title } from 'react-native-paper';
import Posts from './Posts';

export default function HomeScreen({ userData }) {
  return (
    <SafeAreaView>
      <Title style={{ textAlign: "center" }}>
        Welcome, {userData.firstname}
      </Title>
      <Posts userData={userData} username={undefined} height="100%" />
    </SafeAreaView>
  );
}
