import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Portal,
  Dialog,
  TextInput,
} from "react-native-paper";

import axios from "axios";

import baseUrl from "../utils/constants";

export default function Posts({ userData, username, height }) {
  const [posts, setPosts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentVisible, setCommentVisible] = useState(false);
  const [curPost, setCurPost] = useState({});

  useEffect(() => {
    async function doAPIRequest() {
      if (username) {
        const res = await axios
          .get(`${baseUrl}/post/feed/${username}`)
          .catch((error) => {
            alert(error);
          });
        setPosts(res.data.data);
      } else {
        const res = await axios
          .get(`${baseUrl}/post/feed/${userData.username}/all`)
          .catch((error) => {
            alert(error);
          });
        setPosts(res.data.data);
      }
    }
    doAPIRequest();
  }, []);

  async function postComment() {
    const json = JSON.stringify({
      commenter: userData.username,
      content: commentText,
      commentTime: Date.now(),
    });
    await axios
      .post(`${baseUrl}/post/${curPost.poster}${curPost.time}/comments`, json, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        alert(error);
      });
    setCommentText("");
  }

  async function getComments(post) {
    const res = await axios.get(
      `${baseUrl}/post/${post.poster}${post.time}/comments`
    );
    setComments(res.data.data);
  }

  function renderComments() {
    const uiItems = [];
    comments.forEach((element) => {
      uiItems.push(
        <Card key={`${element.commenter}-${element.commentTime}`}>
          <Card.Title
            title={element.commenter}
            subtitle={new Date(element.commentTime).toLocaleString()}
          />
          <Card.Content>
            <Paragraph>{element.content}</Paragraph>
          </Card.Content>
        </Card>
      );
    });
    return uiItems;
  }

  function renderImage(media) {
    if (media) {
      return (
        <Card.Cover
          source={{
            uri: `https://storage.googleapis.com/adaptstorage350/${media}`,
          }}
        />
      );
    }
    return null;
  }

  function renderPosts() {
    if (posts.length !== 0) {
      const uiItems = [];
      posts.forEach((element) => {
        uiItems.push(
          <Card key={`${element.title}-${element.time}`}>
            <Card.Title
              title={element.poster}
              subtitle={new Date(element.time).toLocaleString()}
            />
            <Card.Content>
              <Title>{element.title}</Title>
              <Paragraph>{element.body}</Paragraph>
            </Card.Content>
            {renderImage(element.media)}
            <Card.Actions>
              <Button
                onPress={() => {
                  setCommentVisible(true);
                  setCurPost(element);
                }}
              >
                Comment
              </Button>
              <Button
                onPress={() => {
                  getComments(element);
                  setVisible(true);
                }}
              >
                View Comments
              </Button>
            </Card.Actions>
          </Card>
        );
      });
      return uiItems;
    }
    return null;
  }

  return (
    <View style={{ height }}>
      <ScrollView>{renderPosts()}</ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={() => setVisible(false)}>
          <Dialog.Title>Comments</Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>{renderComments()}</ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setVisible(false)}>Ok</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={commentVisible}>
          <Dialog.Content>
            <TextInput
              label="Comment"
              value={commentText}
              onChangeText={(text) => setCommentText(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setCommentVisible(false);
                setCommentText("");
              }}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                setCommentVisible(false);
                postComment();
              }}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
