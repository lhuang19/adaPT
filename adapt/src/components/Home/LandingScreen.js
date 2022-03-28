import React, { useState } from "react";
import { DownSquareOutlined } from "@ant-design/icons";
import Texty from "rc-texty";
import styles from "./Home.module.scss";

function LandingScreen() {
  const [doAnimation, setDoAnimation] = useState(true);
  function animationEnd() {
    setTimeout(() => {
      setDoAnimation(false);
      setTimeout(() => {
        setDoAnimation(true);
      }, 2500);
    }, 10000);
  }
  return (
    <div
      style={{
        display: "absolute",
        top: "0",
        left: "0",
        height: "100vh",
        width: "100vw",
      }}
      className={styles.flow}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, -50%)",
          top: "50%",
        }}
      >
        <Texty
          style={{
            fontSize: "80px",
            width: "800px",
            textAlign: "center",
            height: "100px",
          }}
          type={doAnimation ? "right" : "left"}
          onEnd={() => animationEnd()}
          duration={500}
          mode="smooth"
        >
          {doAnimation && "The Road To Recovery"}
        </Texty>
        <Texty
          style={{ textAlign: "center" }}
          delay={1000}
          duration={500}
          type={doAnimation ? "right" : "left"}
          mode="smooth"
        >
          {doAnimation && "Starts Here"}
        </Texty>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bottom: "50px",
        }}
      >
        <DownSquareOutlined
          style={{
            display: "block",
            margin: "auto",
            fontSize: "48px",
          }}
          className={styles.pulseOut}
        />
      </div>
    </div>
  );
}

export default LandingScreen;
