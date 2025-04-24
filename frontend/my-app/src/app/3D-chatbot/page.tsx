"use client";
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "../../components/Experience";
import { UI } from "../../components/UI";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

function App() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm"
          onClick={() => router.push('/chatbot')}
        >
          <MessageSquare className="w-4 h-4" />
          Switch to Regular Chat
        </Button>
      </div>
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
