import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { List, Divider, Appbar } from 'react-native-paper';
import { SvgUri } from 'react-native-svg';
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
  const { friends } = userData;
  const [friend, setFriend] = useState("");
  const [showChat, setShowChat] = useState(false);

  function openChat(friend) {
    if (friend !== "") {
      setFriend(friend);
      setShowChat(true);
    }
  }

  if (showChat) {
    return (
      <><Appbar.Header>
        <Appbar.BackAction onPress={() => setShowChat(false)} />
        <Appbar.Content title={friend} />
      </Appbar.Header>
      <ChatScreen userData={userData} friend={friend} /></>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Chats" />
      </Appbar.Header>
      <FlatList
        data={friends}
        keyExtractor={item => item}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item)}
          >
            <List.Item
              title={item}
              titleStyle={styles.listTitle}
              left={() => 
                <SvgUri
                  width={40}
                  height={40}
                  uri={`https://joeschmoe.io/api/v1/${item}`} 
                />
              }
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}