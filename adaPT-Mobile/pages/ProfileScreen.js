import React, { useEffect, useState } from 'react';
import {
  Text, StyleSheet, View, SafeAreaView,
} from 'react-native';
import { Button } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';

import axios from 'axios';

// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from '@env';

import Posts from './Posts';

const baseUrl = `${BASE_URL}/api`;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  picture: {
    marginTop: 10,
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
    flexDirection: 'row',
  },
});

export default function ProfileScreen({ userData, profile, height }) {
  const [profileData, setProfileData] = useState([]);
  const [status, setStatus] = useState(-2);

  async function getProfileData() {
    const res = await axios.get(`${baseUrl}/user/${profile}`)
      .catch((error) => {
        alert(error);
      });
    if (res) {
      setProfileData(res.data.data);
    } else {
      alert('An error has occurred. Please try again.');
    }
  }

  useEffect(() => {
    if (userData.username !== profile) {
      getProfileData();
    } else {
      setProfileData(userData);
    }
  }, []);

  function renderButton() {
    if (userData.username === profile) {
      return null;
    }

    async function doAPIRequest() {
      const res = await axios.get(`${baseUrl}/profile/${userData.username}/${profile}`)
        .catch((error) => {
          alert(error);
        });
      if (res) {
        setStatus(res.data.data);
      } else {
        alert('An error occurred. Please try again.');
      }
    }
    doAPIRequest();

    if (status === -2) {
      return (
        <Button
          mode="outlined"
          loading
        >
          Loading
        </Button>
      );
    }
    if (status === -1) {
      return (
        <Button
          mode="contained"
          onPress={async () => {
            if (userData.length === 0) {
              return;
            }
            const res = await axios.post(`${baseUrl}/profile/friendRequest/${userData.username}/${profile}`)
              .catch((error) => {
                alert(error);
              });
            setStatus(res.data.data);
          }}
          color="#1890FF"
        >
          Request Friend
        </Button>
      );
    } if (status === 0) {
      return (
        <Button
          mode="contained"
          onPress={async () => {
            const res = await axios.delete(`${baseUrl}/profile/friend/${userData.username}/${profile}`)
              .catch((error) => {
                alert(error);
              });
            if (res.data.data !== 100) {
              setStatus(res.data.data);
              return;
            }
            setStatus(-1);
          }}
          color="#FF7875"
        >
          Remove Friend
        </Button>
      );
    } if (status === 1) {
      return (
        <Button
          mode="contained"
          onPress={async () => {
            const res = await axios.get(`${baseUrl}/profile/${userData.username}/${profile}`)
              .catch((error) => {
                alert(error);
              });
            setStatus(res.data.data);
          }}
          color="#1890FF"
        >
          Requested Friend
        </Button>
      );
    }
    return (
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={async () => {
            const res = await axios.delete(`${baseUrl}/profile/friendRequest/${profile}/${userData.username}`)
              .catch((error) => {
                alert(error);
              });
            if (res.data.data !== 100) {
              setStatus(res.data.data);
              return;
            }
            setStatus(0);
            await axios.post(`${baseUrl}/profile/friend/${profile}/${userData.username}`)
              .catch((error) => {
                alert(error);
              });
          }}
          color="#1890FF"
        >
          Accept
        </Button>
        <Button
          mode="contained"
          onPress={async () => {
            await axios.delete(`${baseUrl}/profile/friendRequest/${profile}/${userData.username}`)
              .catch((error) => {
                alert(error);
              });
            setStatus(-1);
          }}
          color="#FF7875"
        >
          Decline
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <SvgUri
          width={100}
          height={100}
          uri={`https://joeschmoe.io/api/v1/${profileData.username}`}
          style={styles.picture}
        />
        <Text style={styles.title}>
          {profileData.firstname}
          {' '}
          {profileData.lastname}
        </Text>
        <Text style={styles.subtitle}>
          {profileData.username}
        </Text>
        {renderButton()}
      </View>
      <Posts userData={userData} username={profile} height={height} />
    </SafeAreaView>
  );
}
