import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createOpenAIFnRunnable } from "langchain/chains/openai_functions";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/text", async (req, res) => {
  const chatModel = new ChatOpenAI({
    openAIApiKey: "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",
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a Great AI just keep answering short and simple to the question.",
    ],
    ["user", "{input}"],
  ]);

  const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

  const result = await chain.invoke({
    input: "what is fiction in physics?",
  });
  console.log("hii", result);
});

router.get("/text2", async (req, res) => {
  const chatModel = new ChatOpenAI({
    openAIApiKey: "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",
  });

  const personDetailsFunction = {
    name: "get_person_details",
    description: "Get details about a person",
    parameters: {
      title: "Person",
      description: "Identifying information about a person.",
      type: "object",
      properties: {
        name: {
          title: "Name",
          description: "The person's name",
          type: "string",
        },
        age: { title: "Age", description: "The person's age", type: "integer" },
        fav_food: {
          title: "Fav Food",
          description: "The person's favorite food",
          type: "string",
        },
      },
      required: ["name", "age"],
    },
  };

  const prompt = ChatPromptTemplate.fromMessages([
    ["human", "Question: {question}"],
  ]);
  const outputParser = new JsonOutputFunctionsParser();
  const weatherFunction = () => {
    console.log("hello weather");
    return { weather: "Its cool" };
  };
  const runnable = createOpenAIFnRunnable({
    functions: [personDetailsFunction, weatherFunction()],
    llm: chatModel,
    prompt,
    enforceSingleFunctionUsage: false, // Default is true
    outputParser,
  });
  const response = await runnable.invoke({
    question: "What's the weather like in Berkeley CA?",
  });
  console.log("text2", response);
});

export default router;
