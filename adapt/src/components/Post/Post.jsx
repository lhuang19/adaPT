import React from "react";
import { getPost, getProfilePicURL } from "../../modules/storage";

function Post({ postID }) {
  // post is JSON with username, timestamp, text, and imageURL
  const post = getPost(postID);
  const { username, timestamp, text, imageURL } = post;
  return (
    <div
      style={{
        border: "1px solid #969696",
        borderRadius: "2vw",
        maxWidth: "80vw",
        padding: "4vw",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          paddingBottom: "1vw",
        }}
      >
        <img
          src={getProfilePicURL(username)}
          alt={username.concat("'s profile picture")}
          width="100vw"
          height="100vw"
        />
        <div
          style={{
            paddingLeft: "1vw",
          }}
        >
          <h2>{username}</h2>
          <p>{timestamp.toString()}</p>
          {
            // TODO Format timestamp better
          }
        </div>
      </div>
      <p>{text}</p>
      {imageURL.length > 0 ? (
        <img src={imageURL} alt={"A post from ".concat(username)} />
      ) : null}
      {
        // TODO Figure out how to make image fit neatly in div
      }
    </div>
  );
}

export default Post;
