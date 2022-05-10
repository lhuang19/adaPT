import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';
import axios from 'axios';

// eslint-disable-next-line import/no-unresolved
import { BASE_URL } from '@env';

import ProfileScreen from './ProfileScreen';

const baseUrl = 'http://10.102.250.188:8000';

const styles = StyleSheet.create({
  item: {
    borderRadius: 20,
    borderColor: '#000000',
  },
});

const accountIcon = <List.Icon icon="account" />;

export default function SearchScreen({ userData }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [profile, setProfile] = useState('');

  function handleChangeText(value) {
    async function doAPIRequest() {
      const res = await axios.get(`${baseUrl}/user`)
        .catch((error) => {
          alert(error.response.data.error);
        });
      if (res) {
        setUsernames(res.data.data);
      } else {
        setUsernames([]);
      }
    }

    setQuery(value);
    setProfile('');
    doAPIRequest();
    let res = [];

    if (!value) {
      res = [];
    } else {
      res = usernames.filter((username) => username.startsWith(value));
      res = res.slice(0, 5);
    }

    setResults(res);
  }

  function renderResults() {
    if (profile !== '') {
      return null;
    }
    if (results.length !== 0) {
      const uiItems = [];
      results.forEach((element) => {
        uiItems.push(
          <List.Item
            title={element}
            key={element}
            descriptionNumberOfLines={16}
            style={styles.item}
            left={() => accountIcon}
            onPress={() => setProfile(element)}
          />,
        );
      });
      return uiItems;
    }
    return null;
  }

  function renderPosts() {
    if (profile !== '') {
      return (
        <ProfileScreen userData={userData} profile={profile} height="71%" />
      );
    }
    return null;
  }

  return (
    <SafeAreaView>
      <Searchbar
        placeholder="Search..."
        onChangeText={(value) => handleChangeText(value)}
        value={query}
      />
      <List.Section>
        {renderResults()}
      </List.Section>
      {renderPosts()}
    </SafeAreaView>
  );
}
