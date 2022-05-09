import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { List, Avatar, Divider } from 'react-native-paper';
import ChatScreen from './ChatScreen';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
});

export default function MessageScreen({ userData }) {
  // console.log(route.params);
  // const userData = route.params.userData;
  // console.log("messageg params");
  // console.log(userData);
  const { username, friends } = userData;
  const [friend, setFriend] = useState("");
  const [showChat, setShowChat] = useState(false);
  // console.log(userData.username);
  // console.log(userData.friends);

  function openChat(friend) {
    if (friend !== "") {
      setFriend(friend);
      setShowChat(true);
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
            // onPress={() => navigation.navigate('ChatScreen', { userData: userData, friend: element })}
            onPress={() => openChat(element)}
          />
        );
      });
      return uiItems;
    }
    return null;
  }

  if (showChat) {
    return (
      <ChatScreen userData={userData} friend={friend} />
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderList()}
    </SafeAreaView>
  );
}

// import React, { useState } from 'react';
// import { View, SafeAreaView, StyleSheet } from 'react-native';
// import { Searchbar, List } from 'react-native-paper';
// import ChatScreen from './ChatScreen';

// import axios from 'axios';

// const baseUrl = 'http://10.102.250.188:8000';

// const styles = StyleSheet.create({
//   item: {
//     borderRadius: 20,
//     borderColor:'#000000',
//   },
// });

// export default function MessageScreen({ userData }) {
//   const [query, setQuery] = useState("");
//   const [results, setResults] = useState([]);
//   const [chatFriend, setChatFriend] = useState("");

//   // async function doAPIRequest() {
//   //   const res = await axios.get(`${baseUrl}/api/user`)
//   //   .catch((error) => {
//   //     alert(error.response.data.error);
//   //   });
//   //   if (res) {
//   //     setUsernames(res.data.data);
//   //   } else {
//   //     setUsernames([]);
//   //   }
//   // }

//   function handleChangeText(value) {
//     setQuery(value);
//     setChatFriend("");
//     // doAPIRequest();
//     let res = [];

//     if (value) {
//       res = userData.friends.filter((username) => username.startsWith(value));
//       res = res.slice(0, 5);
//     }

//     setResults(res);
//   }

//   function renderResults() {
//     if (chatFriend !== "") {
//       console.log("chatFriend");
//       return (
//         // <View>
//           <ChatScreen userData={userData} friend={chatFriend} />
//         // </View>
//       );
//     }
//     if (results.length !== 0) {
//       let uiItems = [];
//       results.forEach((element) => {
//         uiItems.push(
//           <List.Section>
//             <List.Item
//               title={element}
//               key={element}
//               descriptionNumberOfLines={16}
//               style={styles.item}
//               left={() => <List.Icon icon="account" />}
//               onPress={() => setChatFriend(element)}
//             />
//           </List.Section>,
//         );
//       });
//       return uiItems;
//     }
//     return null;
//   }

//   return (
//     <SafeAreaView>
//       <Searchbar
//         placeholder="Search..."
//         onChangeText={(value) => handleChangeText(value)}
//         value={query}
//       />
//       {renderResults()}
//     </SafeAreaView>
//   );
// }