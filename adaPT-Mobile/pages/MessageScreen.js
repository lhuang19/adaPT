import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { List } from 'react-native-paper';

import axios from 'axios';

const baseUrl = 'http://10.102.250.188:8000';

export default function MessageScreen(userData) {

  const { username } = userData;
  const [friends, setFriends] = useState([]);

  async function getFriends() {
    if (username.length > 0) {
      const res = await axios.get(`${baseUrl}/api/user/${username}`)
        .catch((error) => {
          alert(error);
        });
      if (res) {
        const friendList = res.data.friends;
        friendList.filter((friend) => friend !== username);
        setFriends(friendList);
      } else {
        alert("An error has occurred. Unable to retrieve chats.");
      }
    }
  }
  useEffect(() => {
    getFriends();
  }, []);

  function openChat(friend) {
    if (friend !== "") {
      return (
        <View>
          <ChatScreen userData={userData} friend={friend} />
        </View>
      );
    }
  }

  function renderList() {
    if (friends.length !== 0) {
      let uiItems = [];
      friends.forEach((element) => {
        uiItems.push(
          <List.Item
            title={element}
            key={element}
            descriptionNumberOfLines={4}
            // style={styles.item}
            left={() => <List.Icon icon="account" />}
            onPress={() => openChat(element)}
          />
        );
      });
      return uiItems;
    }
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      {renderList()}
    </View>
  );
}