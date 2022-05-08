import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';
import axios from 'axios';

import ProfileScreen from './ProfileScreen';

const baseUrl = 'http://10.102.196.128:8000';

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

  function handleChangeText(value) {
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
      return (
        <View>
          <ProfileScreen userData={userData} profile={profile} />
        </View>
      );
    }
    if (results.length !== 0) {
      const uiItems = [];
      results.forEach((element) => {
        uiItems.push(
          <List.Section>
            <List.Item
              title={element}
              key={element}
              descriptionNumberOfLines={16}
              style={styles.item}
              left={accountIcon}
              onPress={() => setProfile(element)}
            />
          </List.Section>,
        );
      });
      return uiItems;
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
      {renderResults()}
    </SafeAreaView>
  );
}
