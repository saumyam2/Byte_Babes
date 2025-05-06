// Modified route handler with cross-platform Rhubarb support
const express = require("express");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const ElevenLabs = require("elevenlabs-node");
const { Groq } = require("groq-sdk");

require("dotenv").config();

const router = express.Router();
const elevenLabsApiKey = process.env.ELEVEN_LABS_API_KEY;
const voiceID = "9BWtsMINqrJLrRacOk9x";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Initialize ElevenLabs with API key
const voice = new ElevenLabs({
  apiKey: elevenLabsApiKey,
});

const execCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(`stderr: ${stderr}`);
        reject(error);
      }
      resolve(stdout);
    });
  });
};

// Get the appropriate Rhubarb executable path based on operating system
const getRhubarbPath = () => {
  const platform = os.platform();
  const arch = os.arch();
  
  // Create a mapping of platforms to their executable paths
  const platformPaths = {
    win32: path.join("bin", "rhubarb", "rhubarb.exe"),
    darwin: path.join("bin", "rhubarb", "rhubarb-mac"),
    linux: path.join("bin", "rhubarb", "rhubarb-linux")
  };

  // Get the platform-specific path or default to the linux version
  const executablePath = platformPaths[platform] || platformPaths.linux;
  
  // Make sure the executable is marked as executable on Unix-based systems
  if (platform !== 'win32') {
    try {
      // Attempt to make the file executable
      exec(`chmod +x ${executablePath}`, (error) => {
        if (error) console.error("Failed to set executable permissions:", error);
      });
    } catch (err) {
      console.error("Error setting executable permissions:", err);
    }
  }
  
  return executablePath;
};

const lipSyncMessage = async (messageIndex) => {
  try {
    await execCommand(`ffmpeg -y -i audios/message_${messageIndex}.mp3 audios/message_${messageIndex}.wav`);
    
    const rhubarbPath = getRhubarbPath();
    console.log(`Using Rhubarb at: ${rhubarbPath}`);
    
    // Use proper path syntax for Windows if needed
    const command = `${rhubarbPath} -f json -o audios/message_${messageIndex}.json audios/message_${messageIndex}.wav -r phonetic`;
    console.log(`Executing command: ${command}`);
    
    await execCommand(command);
  } catch (error) {
    console.error(`Error in lipSyncMessage for message ${messageIndex}:`, error);
    // Create a fallback empty lipsync file in case of failure
    await fs.writeFile(
      `audios/message_${messageIndex}.json`, 
      JSON.stringify({ mouthCues: [] }), 
      "utf8"
    );
  }
};

const readJsonTranscript = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${file}:`, error);
    // Return a fallback empty lipsync object
    return { mouthCues: [] };
  }
};

const audioFileToBase64 = async (file) => {
  try {
    const data = await fs.readFile(file);
    return data.toString("base64");
  } catch (error) {
    console.error(`Error converting audio file ${file} to base64:`, error);
    return "";
  }
};

router.post("/voice", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    try {
      return res.send({
        messages: [
          {
            text: "Hey there! How can I help you today?",
            audio: await audioFileToBase64("audios/intro_0.wav"),
            lipsync: await readJsonTranscript("audios/intro_0.json"),
            facialExpression: "smile",
            animation: "Talking_1",
          },
        ],
      });
    } catch (error) {
      console.error("Error sending default response:", error);
      return res.status(500).json({ error: "Failed to send default response" });
    }
  }

  try {
    // Ensure the audios directory exists
    await fs.mkdir("audios", { recursive: true }).catch(err => {
      console.log("Audios directory already exists or couldn't be created");
    });

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      max_tokens: 1000,
      temperature: 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
          You are Asha, an empathetic AI assistant for JobsForHer Foundation. Your purpose is to support women in their career journeys with warmth, understanding, and encouragement.

          Key personality traits:
          - Warm and supportive
          - Empowering
          - Inclusive
          - Informative
          - Emotionally intelligent

          Reply with a JSON array of messages (max 3) with text, facialExpression, and animation.
          facialExpression: smile, sad, angry, surprised, funnyFace, default
          animation: Talking_0, Talking_1, Talking_2, Crying, Laughing, Rumba, Idle, Terrified, Angry
          `,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    let messages = JSON.parse(completion.choices[0].message.content);
    if (messages.messages) messages = messages.messages;

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const fileName = `audios/message_${i}.mp3`;
      
      // Use the correct method call for text-to-speech
      await voice.textToSpeech({
        textInput: message.text,
        fileName: fileName,
        voiceId: voiceID,
        modelId: "eleven_multilingual_v2"
      });

      await lipSyncMessage(i);
      message.audio = await audioFileToBase64(fileName);
      message.lipsync = await readJsonTranscript(`audios/message_${i}.json`);
    }

    res.send({ messages });

  } catch (error) {
    console.error("Voice Chat Error:", error);
    res.status(500).json({ error: "Voice chat failed: " + error.message });
  }
});

module.exports = router;