import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Comment,
  Avatar,
  Form,
  Button,
  List,
  Input,
  Collapse,
  Divider,
} from "antd";

import { AuthUserContext } from "../../../context/Auth";

import { getComments, postComment } from "../../../modules/storage";

const { Panel } = Collapse;
const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={2} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item
      style={{
        marginBottom: "0px",
        paddingBottom: "0px",
      }}
    >
      <Button
        htmlType="submit"
        loading={submitting}
        onClick={onSubmit}
        type="primary"
      >
        Add Comment
      </Button>
    </Form.Item>
  </>
);

function Comments({ poster, time }) {
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;

  const ref = useRef(null);
  const [input, setInput] = useState("");
  const [commentBox, setCommentBox] = useState(false);
  const [commentData, setCommentData] = useState([]);

  function onSubmitCommentHandler() {
    console.log("submit");
    setInput("");
    const submitTime = Date.now();
    postComment(poster, time, username, input, Date.now());
    const current = [...commentData];
    current.push({
      postid: poster + time,
      commenter: username,
      content: input,
      commentTime: submitTime,
    });
    setCommentData(current);
    setTimeout(() => {
      if (ref.current != null) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, 100);
  }

  useEffect(() => {
    console.log(poster, time);
    setCommentData(getComments(poster, time));
  }, []);

  useEffect(() => {
    console.log(ref.current);
  }, [ref.current]);
  return (
    <Collapse
      bordered={false}
      onChange={(e) => {
        setTimeout(() => {
          if (e.length > 0 && ref.current != null) {
            ref.current.scrollTop = ref.current.scrollHeight;
          }
        }, 100);
      }}
    >
      <Panel header="Comments" forceRender={true}>
        {commentData.length} {commentData.length > 1 ? "replies" : "reply"}
        <Divider style={{ margin: "1px", padding: "0px" }} />
        <div
          ref={ref}
          style={{
            maxHeight: "200px",
            overflow: "scroll",
            scrollBehavior: "smooth",
          }}
        >
          <List
            dataSource={commentData}
            itemLayout="horizontal"
            renderItem={(props) => (
              <Comment
                author={props.commenter}
                content={props.content}
                datetime={new Date(props.commentTime).toLocaleString()}
                avatar={
                  <Avatar
                    src={`https://joeschmoe.io/api/v1/${props.commenter}`}
                  />
                }
              />
            )}
          />
        </div>
        {commentBox ? (
          <Comment
            avatar={<Avatar src={`https://joeschmoe.io/api/v1/${username}`} />}
            content={
              <Editor
                onChange={(e) => setInput(e.target.value)}
                onSubmit={() => onSubmitCommentHandler()}
                value={input}
              />
            }
          />
        ) : null}
        <Button type="link" onClick={() => setCommentBox(!commentBox)}>
          Comment
        </Button>
      </Panel>
    </Collapse>
  );
}

export default Comments;
