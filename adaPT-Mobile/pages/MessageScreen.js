import React, { useState } from 'react';
import {
  StyleSheet, SafeAreaView, FlatList, TouchableOpacity,
} from 'react-native';
import {
  Title, List, Divider, Appbar,
} from 'react-native-paper';
import { SvgUri } from 'react-native-svg';
import ChatScreen from './ChatScreen';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  listTitle: {
    fontSize: 22,
  },
});

export default function MessageScreen({ userData }) {
  const { friends } = userData;
  const [friend, setFriend] = useState('');
  const [showChat, setShowChat] = useState(false);

  function openChat(user) {
    if (user !== '') {
      setFriend(user);
      setShowChat(true);
    }
  }

  function renderDivider() {
    return <Divider />;
  }

  function renderAvatar(user) {
    return (
      <SvgUri
        width={40}
        height={40}
        uri={`https://joeschmoe.io/api/v1/${user}`}
      />
    );
  }

  if (showChat) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => setShowChat(false)} />
          <Appbar.Content title={friend} />
        </Appbar.Header>
        <ChatScreen userData={userData} friend={friend} />
      </>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Title style={{ textAlign: 'center' }}>
        Chats
      </Title>
      <FlatList
        data={friends}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => renderDivider()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => openChat(item)}
          >
            <List.Item
              title={item}
              titleStyle={styles.listTitle}
              left={() => renderAvatar(item)}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
