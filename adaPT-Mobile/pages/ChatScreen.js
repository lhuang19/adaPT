import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';

import axios from 'axios';

const baseUrl = 'http://10.102.250.188:8000';

export default function ChatScreen(userData, friend) {

  const [messages, setMessages] = useState([]);
  const { Content, Sider } = Layout;
  const { TextArea } = Input;
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

  function scrollToBottom() {
    setTimeout(() => {
      const element = document.getElementById("scrollable");
      element.scrollTop = element.scrollHeight;
    }, 100);
  }

  async function fetchNewMessages() {
    const res = await axios.get(`${baseUrl}/api/chat/${userData.username}`)
      .catch((error) => {
        alert(error);
      });
    if (res) {
      setCurrMessages(
        res.data.filter(
        (message) =>
          message.receiver === currChattingUser ||
          message.sender === currChattingUser
        )
      );
    } else {
    alert("An error has occurred. Unable to fetch messages.");
    }
  }
  useInterval(async () => {
    fetchNewMessages(true);
  }, 1000);
  useEffect(() => {
    scrollToBottom();
  }, [currMessages]);

  async function onSendMessageHandler() {
    // construct the message here
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
      setMessages([
        ...messages,
        { message },
      ]);
      setInput("");
    }
  }

  return (
    <View>
      {/* show messages */}
      <TextInput
        onChangeText={text => setInput(text)}
        value={input}
      />
      <IconButton
        icon="send"
        size={20}
        onPress={() => onSendMessageHandler()}
      />
    </View>  
  );
}