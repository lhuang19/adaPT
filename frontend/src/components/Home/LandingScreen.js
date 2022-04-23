import React, { useEffect, Suspense } from "react";
import { DownSquareOutlined } from "@ant-design/icons";
import { Canvas, useFrame } from "@react-three/fiber";

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import Texty from "rc-texty";
import styles from "./Home.module.scss";

const GLTF_FILE = "/smooth_run0.gltf";

function Model() {
  const { scene, animations } = useGLTF(GLTF_FILE);
  scene.rotation.y = Math.PI / 2 - 0.5;
  scene.position.y = -1.5;
  const mixer = new THREE.AnimationMixer(scene);
  animations.forEach((clip) => {
    const action = mixer.clipAction(clip);
    action.timeScale = 0.75;
    action.play();
  });
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return (
    <Suspense fallback={null}>
      <primitive object={scene} scale={2.0} />
    </Suspense>
  );
}

useGLTF.preload(GLTF_FILE);

function LandingScreen() {
  useEffect(() => {}, []);

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
      <Canvas
        style={{
          display: "absolute",
          top: "0px",
          left: "0px",
          height: "100vh",
          width: "100vw",
        }}
        camera={{ fov: 25, near: 1, far: 1000, position: [0, 5, 10] }}
      >
        <ambientLight intensity={0.5} />

        <spotLight
          castShadow
          color="orange"
          intensity={2}
          position={[-50, 50, 40]}
          angle={0.25}
          penumbra={1}
          shadow-mapSize={[128, 128]}
          shadow-bias={0.00005}
        />

        <Model />
      </Canvas>
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
          duration={1400}
          delay={500}
          mode="smooth"
        >
          The Road To Recovery
        </Texty>
        <Texty
          style={{ textAlign: "center" }}
          delay={2000}
          duration={1000}
          mode="smooth"
        >
          Starts Here
        </Texty>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bottom: "50px",
          opacity: "0.5",
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
