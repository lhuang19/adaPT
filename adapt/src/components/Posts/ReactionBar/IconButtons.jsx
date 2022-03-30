import React, { useState, cloneElement, useEffect } from "react";
import styles from "./ReactionBar.module.scss";
import { postReaction, deleteReaction } from "../../../modules/storage";

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
  const [selected, setSelected] = useState(initialState ? initialState : false);
  const [num, setNum] = useState(count);
  function reactionHandler() {
    if (selected) {
      deleteReaction(poster, time, username, name);
      setNum(num - 1);
    } else {
      postReaction(poster, time, username, name);
      setNum(num + 1);
    }
  }
  const cloned = cloneElement(icon, {
    className: styles.asButton,
    onClick: () => {
      reactionHandler();
      setSelected(!selected);
    },
    twoToneColor: selected ? selectedColor : "#CCCCCC",
  });
  useEffect(() => {
    setNum(count);
  }, [count]);
  return (
    <div
      style={{
        textAlign: "center",
        boxShadow: "0px 1px 2px 0px grey",
        borderRadius: "10px",
        paddingTop: "4px",
        paddingLeft: "4px",
        paddingRight: "4px",
      }}
    >
      <div
        className={styles.asButton}
        style={{ marginLeft: "5px", marginRight: "5px" }}
      >
        {cloned}
      </div>
      <p className={styles.noselect}>{num}</p>
    </div>
  );
}

export default IconButton;
