import React, { useState } from 'react';

import { Button, TextInput, Text } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';

import axios from 'axios';

// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from '@env';

const baseUrl = `${BASE_URL}/api`;

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function loginHandler(login) {
    console.log(baseUrl);
    const json = JSON.stringify(login);
    const res = await axios.post(`${baseUrl}/login`, json, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .catch((error) => {
        console.log(error.response.data);
        alert(error);
      });
    if (res) {
      console.log(res.data.data);
      navigation.navigate('Start', {
        userData: res.data.data,
      });
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#fff',
      padding: 10,
      margin: 10,
    },
    title: {
      paddingVertical: 12,
      textAlign: 'center',
      fontSize: 30,
      fontWeight: 'bold',
    },
    button: {
      paddingVertical: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        adaPT Sign In
      </Text>
      <TextInput
        label="Username"
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        left={<TextInput.Icon name="account" />}
        style={styles.element}
      />
      <TextInput
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        left={<TextInput.Icon name="lock" />}
        style={styles.element}
      />
      <Button
        mode="contained"
        onPress={() => {
          loginHandler({ username, password });
        }}
        style={styles.button}
      >
        Login
      </Button>
    </SafeAreaView>
  );
}

export default LoginScreen;
