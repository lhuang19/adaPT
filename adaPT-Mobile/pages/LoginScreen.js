import 'react-native-gesture-handler';
 
import * as React from 'react';

import { Button, TextInput, Text } from 'react-native-paper';
import { View, SafeAreaView, StyleSheet } from 'react-native';

function LoginScreen() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

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
        onPress={() => console.log('Pressed')}
        style={styles.button}
      >
        Login
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 100,
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

export default LoginScreen;