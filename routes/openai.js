import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";

dotenv.config();

const router = express.Router();
router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    console.log("text", text, req);

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: text,
    //   temperature: 0.5,
    //   max_tokens: 2048,
    //   top_p: 1,
    //   frequency_penalty: 0.5,
    //   presence_penalty: 0,
    // });
    const response = await openai.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "gpt-3.5-turbo",
    });

    console.log("res message", response.choices[0].message.content);
    const resChat = await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USERNAME,
          "User-Secret": process.env.BOT_USERSCERET,
        },
      }
    );
    console.log("reschat", resChat);

    // const chatCompletion = await openai.chat.completions.create({
    //   messages: [{ role: "user", content: "Say this is a test" }],
    //   model: "gpt-3.5-turbo",
    // });

    res.json({ message: response.choices[0].message.content }); // Send a response.
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
