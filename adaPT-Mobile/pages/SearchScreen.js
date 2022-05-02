import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Searchbar, List } from 'react-native-paper';
import ProfileScreen from './ProfileScreen';

import axios from 'axios';

const baseUrl = 'http://10.102.227.130:8000';

const styles = StyleSheet.create({
  item: {
    borderRadius: 20,
    borderColor:'#000000',
  },
});

export default function SearchScreen({ userData }) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState([]);
  const [usernames, setUsernames] = React.useState([]);
  const [profile, setProfile] = React.useState("");

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
    setProfile("");
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
    if (profile !== "") {
      return (
        <View>
          <ProfileScreen userData={userData} profile={profile} />
        </View>
      );
    }
    if (results.length !== 0) {
      let uiItems = [];
      results.forEach((element) => {
        uiItems.push(
          <List.Section>
            <List.Item
              title={element}
              key={element}
              descriptionNumberOfLines={16}
              style={styles.item}
              left={() => <List.Icon icon="account" />}
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
        onChangeText={(value) => handleChangeText(value.toLowerCase())}
        value={query}
      />
      {renderResults()}
    </SafeAreaView>
  );
}
