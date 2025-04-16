"use client";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "../../components/Experience";
import { UI } from "../../components/UI";

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader />
      <Leva hidden />
      <UI hidden={false}/>
      <Canvas 
        shadows 
        camera={{ position: [0, 1, 1], fov: 70 }}
        className="w-full h-full"
        style={{ position: 'absolute' }}
      >
        <Experience />
      </Canvas>
    </div>
  );
}

export default App;
