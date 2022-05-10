import React, { useState, cloneElement, useEffect } from "react";
import styles from "./ReactionBar.module.scss";
import { doAPIRequest } from "../../../modules/api";

function IconButton({
  poster,
  time,
  username,
  icon,
  name,
  selectedColor,
  initialState,
  count,
}) {
  const [selected, setSelected] = useState(initialState);
  const [num, setNum] = useState(count);
  function reactionHandler() {
    if (selected) {
      doAPIRequest(`/post/${poster}${time}/reactions/${username}/${name}`, {
        method: "DELETE",
      });
      setNum(num - 1);
    } else {
      doAPIRequest("/post/reactions", {
        method: "POST",
        body: { poster, time, username, type: name },
      });
      setNum(num + 1);
    }
  }
  const cloned = cloneElement(icon, {
    twoToneColor: selected ? selectedColor : "#CCCCCC",
  });
  useEffect(() => {
    setNum(count);
  }, [count]);
  return (
    <div
      style={{
        background: "grey",
        height: "25px",
        borderRadius: "3px",
        marginBottom: "5px",
      }}
    >
      <div
        className={styles.asButton}
        style={{
          position: "relative",
          top: "-3px",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "3px",
          height: "25px",
          width: "40px",
          display: "flex",
        }}
        onClick={() => {
          reactionHandler();
          setSelected(!selected);
        }}
        data-testid="icon-button"
      >
        <div style={{ marginRight: "4px" }}>{cloned}</div>
        <div className={styles.noselect} style={{ fontSize: "10px" }}>
          {num}
        </div>
      </div>
    </div>
  );
}

export default IconButton;
