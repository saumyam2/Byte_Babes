const express = require("express");
const { exec } = require("child_process");
const fs = require("fs").promises;
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
    exec(command, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    });
  });
};

const lipSyncMessage = async (messageIndex) => {
  await execCommand(`ffmpeg -y -i audios/message_${messageIndex}.mp3 audios/message_${messageIndex}.wav`);
  await execCommand(`./bin/rhubarb/rhubarb -f json -o audios/message_${messageIndex}.json audios/message_${messageIndex}.wav -r phonetic`);
};

const readJsonTranscript = async (file) => {
  const data = await fs.readFile(file, "utf8");
  return JSON.parse(data);
};

const audioFileToBase64 = async (file) => {
  const data = await fs.readFile(file);
  return data.toString("base64");
};

router.post("/voice", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
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
  }

  try {
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
    res.status(500).json({ error: "Voice chat failed." });
  }
});

module.exports = router;
