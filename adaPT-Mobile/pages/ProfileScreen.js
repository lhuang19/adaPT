import React, { useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';

import axios from 'axios';

const baseUrl = 'http://10.102.227.130:8000';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
  },
  picture: {
    marginTop: 50,
  },
  title: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '200',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export default function ProfileScreen({ userData, profile }) {
  const [profileData, setProfileData] = React.useState([]);
  const [status, setStatus] = React.useState(-2);

  useEffect(() => {
    if (userData.username !== profile) {
      async function getProfileData() {
        const res = await axios.get(`${baseUrl}/user/${profile}`)
        .catch((error) => {
          alert(error);
        });
        if (res) {
          setProfileData(res.data.data);
        } else {
          alert("An error has occurred. Please try again.");
        }
      }
      getProfileData();
    } else {
      setProfileData(userData);
    }
  }, []);

  function renderButton() {
    console.log("Rendering...", userData.username, profile);
    console.log(profileData);
    if (userData.username === profile) {
      return (
        <Button
        mode="outlined"
        onPress={() => alert("Implement edit profile")}
        >
          Edit Profile
        </Button>
      );
    }

    async function doAPIRequest() {
      const res = await axios.get(`${baseUrl}/profile/${userData.username}/${profile}`)
      .catch((error) => {
        alert(error);
      });
      if (res) {
        setStatus(res.data.data);
      } else {
        alert("An error occurred. Please try again.");
        return null;
      }
    }
    doAPIRequest();

    console.log("Status: ", status);

    if (status === -2) {
      return (
        <Button
          mode="outlined"
          loading
        >
          Loading
        </Button>
      );
    } else if (status === -1) {
      return (
        <Button
        mode="contained"
        onPress={() => alert("Implement friends")}
        color={"#1890FF"}
        >
          Request Friend
        </Button>
      );
    } else if (status === 0) {
      return (
        <Button
        mode="contained"
        onPress={() => alert("Implement friends")}
        color={"#FF7875"}
        >
          Remove Friend
        </Button>
      );
    } else if (status === 1) {
      return (
        <Button
        mode="contained"
        color={"#1890FF"}
        >
          Requested Friend
        </Button>
      );
    } else {
      return (
        <View style={styles.buttonContainer}>
          <Button
          mode="contained"
          onPress={() => alert("Implement friends")}
          color={"#FF7875"}
          >
            Decline
          </Button>
          <Button
          mode="contained"
          onPress={() => alert("Implement friends")}
          color={"#1890FF"}
          >
            Accept
          </Button>
        </View>
      );
    }
  }

  return (
    <View style={styles.container}>
      <SvgUri
        width={100}
        height={100}
        uri={`https://joeschmoe.io/api/v1/${profileData.username}`}
        style={styles.picture}
      />
      <Text style={styles.title}>
        {profileData.firstname} {profileData.lastname}
      </Text>
      <Text style={styles.subtitle}>
        ({profileData.username})
      </Text>
      {renderButton()}
    </View>
  );
}
