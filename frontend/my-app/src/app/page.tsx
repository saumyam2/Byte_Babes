import { Hero } from "@/components/hero";
// import { NavbarDemo } from "@/components/navbar";
import Image from "next/image";
// import { AnimatedGradientDemo } from "../components/AnimatedGradientDemo";
// import DatabaseWithRestApi from "@/components/ui/database-with-rest-api";
// import { TabsDemo } from "@/components/preview";
import Spline from '@splinetool/react-spline/next';
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Keyboard from "@/components/spline";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <NavbarDemo /> */}
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-5xl font-bold text-center mb-16">How It Works</h2>
          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            Asha AI uses Retrieval-Augmented Generation (RAG) to provide real-time, contextual answers about jobs, events, and mentorships — empowering women with seamless access to trusted career resources.
          </p>

          <div className=" ">
           

            <div className="space-y-8">
            <Keyboard />
              <div className="flex items-start gap-4 p-4 rounded-lg border bg-white/50 backdrop-blur-sm">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="font-semibold mb-1">Start the conversation</h3>
                  <p className="text-muted-foreground">
                    Ask Asha about jobs, mentorship, events, or career guidance — she’s here 24/7 to help you navigate your journey.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border bg-white/50 backdrop-blur-sm">
                <div className="text-2xl">🤖</div>
                <div>
                  <h3 className="font-semibold mb-1">Get smart, real-time answers</h3>
                  <p className="text-muted-foreground">
                    Powered by AI and real-time search, Asha provides personalized responses from trusted sources and the platform itself.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg border bg-white/50 backdrop-blur-sm">
                <div className="text-2xl">🚀</div>
                <div>
                  <h3 className="font-semibold mb-1">Take your next step</h3>
                  <p className="text-muted-foreground">
                    Whether it’s applying for a job, joining a mentorship, or signing up for an event — Asha guides you through it with ease.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-5xl font-bold text-center mb-16">See What We Catch</h2>
          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            Here’s a quick look at anomalies our engine flags. From suspicious discounts to irregular SKU patterns — we help you spot issues early.
          </p>
          {/* <TabsDemo/> */}
        </div>
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-5xl font-bold text-center mb-16">How Our Product Helps</h2>
          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            We eliminate guesswork with AI-driven precision.
            Your sales data becomes a source of strategic insight.
          </p>
          {/* <AnimatedGradientDemo /> */}
        </div>

      </main>
      <footer className="w-full bg-white text-black py-8 px-4 mt-12">


        {/* Optional: Social Icons */}
        <div className="mt-6 flex justify-center gap-4">
          <p>Built with ❤️ by <span className="font-semibold">Byte Babes</span></p>
          <p>Powered by:</p>
          <p className="text-black-300">Next.js · Python · LangChain · Tailwind · Hugging Face</p>
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <FaGithub className="h-5 w-5 hover:text-blue-400" />
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="h-5 w-5 hover:text-blue-400" />
          </a>
        </div>
      </footer>

    </div>
  );
}