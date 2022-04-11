import React, { useState, useEffect } from "react";
import { Space } from "antd";

import {
  SmileTwoTone,
  HeartTwoTone,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import IconButton from "./IconButtons";

import { doAPIRequest } from "../../../modules/api";

function ReactionBar({ poster, time, username }) {
  const [reactions, setReactions] = useState(null);
  async function makeReactionRequest(poster, time, username) {
    const { data } = await doAPIRequest(
      `/post/${poster}${time}/reactions/${username}`,
      {
        method: "GET",
      }
    );
    setReactions(data);
  }
  useEffect(async () => {
    makeReactionRequest(poster, time, username);

    const periodicRefresh = setInterval(async () => {
      makeReactionRequest(poster, time, username);
    }, 100000);

    return () => clearInterval(periodicRefresh);
  }, []);

  return reactions ? (
    <Space>
      <IconButton
        icon={<SmileTwoTone />}
        name="smile"
        selectedColor="#1990FF"
        initialState={reactions.smiled}
        poster={poster}
        time={time}
        username={username}
        count={reactions.smileCount}
      />
      <IconButton
        icon={<HeartTwoTone />}
        name="like"
        selectedColor="#eb2f96"
        initialState={reactions.liked}
        poster={poster}
        time={time}
        username={username}
        count={reactions.likeCount}
      />
      <IconButton
        icon={<CheckCircleTwoTone />}
        name="check"
        selectedColor="#52c41a"
        initialState={reactions.checked}
        poster={poster}
        time={time}
        username={username}
        count={reactions.checkCount}
      />
    </Space>
  ) : null;
}

export default ReactionBar;
