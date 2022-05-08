import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { List, Avatar, Divider } from 'react-native-paper';
import ChatScreen from './ChatScreen';

// import axios from 'axios';
// const baseUrl = 'http://10.102.106.52:8000';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
});

export default function MessageScreen({userData}) {

  const { username, friends } = userData;
  // const [friends, setFriends] = useState([]);

  // async function getFriends() {
  //   if (userData.username.length > 0) {
  //     const res = await axios.get(`${baseUrl}/api/user/${username}`)
  //       .catch((error) => {
  //         alert(error);
  //       });
  //     if (res) {
  //       const friendList = res.data.friends;
  //       friendList.filter((friend) => friend !== username);
  //       setFriends(friendList);
  //     } else {
  //       alert("An error has occurred. Unable to retrieve chats.");
  //     }
  //   }
  // }
  // useEffect(() => {
  //   getFriends();
  // }, []);

  function openChat(friend) {
    if (friend !== "") {
      console.log("in if");
      return (
        // <SafeAreaView>
          <ChatScreen userData={userData} friend={friend} />
        // </SafeAreaView>
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
            titleStyle={styles.listTitle}
            left={() => <Avatar.Image size={40} source={{ uri: `https://joeschmoe.io/api/v1/${element}` }} />}
            onPress={() => openChat(element)}
          />
        );
      });
      return uiItems;
    }
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderList()}
    </SafeAreaView>
  );
}