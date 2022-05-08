import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { GiftedChat } from 'react-native-gifted-chat';

import axios from 'axios';

const baseUrl = 'http://10.102.106.52:8000';

export default function ChatScreen(userData, friend) {

  const [messages, setMessages] = useState([]);
//   const { TextArea } = Input;
  const [input, setInput] = useState("");

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        const id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
      return () => {};
    }, [delay]);
  }

  function convertMessage(message, id) {
    return {
      _id: id,
      text: message.body,
      createdAt: message.time,
      user: {
        _id: message.sender,
        name: message.senderFirstname,
        avatar: `https:/joeschmoe.io/api/v1/${message.sender}`
      }
    }
  }

  async function fetchNewMessages() {
    const res = await axios.get(`${baseUrl}/api/chat/${userData.username}/${friend}`)
      .catch((error) => {
        alert(error);
      });
    if (res) {
      if (res.data.length > messages.length) {
        const newMessages = [];
        for (let i = messages.length; i < data.length; i++) {
          newMessages.push(convertMessage(res.data[i], i));
        }
        setMessages([...messages, ...newMessages]);
      }
      
    } else {
    alert("An error has occurred. Unable to fetch messages.");
    }
  }
  useInterval(async () => {
    fetchNewMessages(true);
  }, 1000);

  async function onSendMessageHandler() {
    const message = {
      body: input,
      time: Date.now(),
      sender: userData,
      receiver: friend,
      senderFirstname: userData.username,
    }
    const json = JSON.stringify(message);
    const res = await axios.post(`${baseUrl}/api/chat`, json, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch((error) => {
      console.log(error.response.data);
      alert(error);
    });
    if (res) {
      // optimistic UI. Assume the message sends and update UI right away.
      let newMessage = convertMessage(message, messages.length);
      setMessages([
        ...messages,
        { newMessage },
      ]);
      setInput("");
    }
  }

//   function renderMessages() {
//     if (messages.length !== 0) {
//       let uiItems = [];
//       messages.forEach((message) => {
//         uiItems.push(
//           <List.Item
//             title={message}
//             description={`${message.senderFirstname }` ${message.time }}
//             // style={styles.item}
//             left={() => <List.Icon icon="account" />}
//           />
//         );
//       });
//       return uiItems;
//     }
//     return null;
//   }

  return (
    <SafeAreaView>
      <GiftedChat
        text={input}
        onInputTextChanged={text => this.setInput(text)}
        messages={messages}
        onSend={() => onSendMessageHandler()}
        user={{ _id: userData.username }}
        scrollToBottom
      />
      {/* <TextInput
        onChangeText={text => setInput(text)}
        value={input}
      />
      <IconButton
        icon="send"
        size={20}
        onPress={() => onSendMessageHandler()}
      /> */}
    </SafeAreaView>  
  );
}