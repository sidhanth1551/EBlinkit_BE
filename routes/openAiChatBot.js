import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { openai } from "../index.js";
import {
  getCurrentWeather,
  getProductsByCategoryChat,
  getProductsByBrandName,
} from "../controllers/openaiController.js";
import { tools } from "../helper/tools.js";

dotenv.config();

const router = express.Router();

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    console.log("text", text, req);

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant designed to output JSON if asked about our related products. Otherwise u can give normal human readble output",
      },
      { role: "user", content: text },
    ];

    const response = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo-1106",
      tools: tools,
      tool_choice: "auto",
      response_format: { type: "json_object" },
    });

    const responseMessage = response.choices[0].message;
    console.log("1st response", responseMessage);
    const toolCalls = responseMessage.tool_calls;
    console.log("toolcalls", toolCalls);

    if (responseMessage.tool_calls) {
      // Step 3: call the function
      // Note: the JSON response may not always be valid; be sure to handle errors
      const availableFunctions = {
        get_current_weather: getCurrentWeather,
        get_products_by_brandName: getProductsByBrandName,
        get_products_byCategory: getProductsByCategoryChat,
      }; // only one function in this example, but you can have multiple
      messages.push(responseMessage); // extend conversation with assistant's reply
      for (const toolCall of toolCalls) {
        const functionName = toolCall.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(toolCall.function.arguments);
        console.log(functionArgs, functionName, functionToCall);
        //const functionResponse = await functionToCall(functionArgs.category);

        let functionResponse;
        try {
          if (functionName === "get_current_weather") {
            functionResponse = await functionToCall(functionArgs.location);
          } else if (functionName === "get_products_by_brandName") {
            console.log("yes");
            functionResponse = await functionToCall(functionArgs.name);
          } else if (functionName === "get_products_byCategory") {
            functionResponse = await functionToCall(functionArgs.category);
          }
        } catch (functionError) {
          console.error(`Error calling ${functionName}:`, functionError);
          functionResponse = "Error processing function";
        }
        console.log("functionResponse", functionResponse);
        messages.push({
          tool_call_id: toolCall.id,
          role: "tool",
          name: functionName,
          content: functionResponse,
        }); // extend conversation with function response
      }

      messages.push({
        role: "system",
        content: "Dont provide or write about image or url in the responses",
      }),
        console.log("message", messages);

      const prodObj = JSON.parse(messages[3].content);
      let imageLink = [];
      for (let i = 0; i < prodObj.products.length; i++) {
        imageLink.push(prodObj.products[i].images[0]);
      }
      console.log("prodObj", prodObj, imageLink);
      messages.shift();
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: messages,
      }); // get a new response from the model where it can see the function response
      console.log("2nd response", secondResponse);
      const resChat = await axios.post(
        `https://api.chatengine.io/chats/${activeChatId}/messages/`,
        {
          text: secondResponse.choices[0].message.content,
          attachment_urls: imageLink,
        },
        {
          headers: {
            "Project-ID": process.env.PROJECT_ID,
            "User-Name": process.env.BOT_USERNAME,
            "User-Secret": process.env.BOT_USERSCERET,
          },
        }
      );

      const methodNameCalled = messages[2].name;
      console.log("methodNameCalled...", methodNameCalled, messages);
      const productAndCategoryResponse =
        prodObj.products.length > 1
          ? "get_products_by_brandName" === methodNameCalled
            ? prodObj.products[0].brand
            : prodObj.products[0].category
          : prodObj.products[0].productname;

      res.json({
        message: secondResponse.choices[0].message.content,
        isCategory:
          prodObj.products.length > 1 &&
          "get_products_by_brandName" !== methodNameCalled,
        isBrand:
          prodObj.products.length > 1 &&
          "get_products_by_brandName" === methodNameCalled,
        isProduct: prodObj.products.length === 1,
        searchedFor: productAndCategoryResponse,
      }); // Send a response.
      return;
    }

    messages.push({
      role: "system",
      content: "Just provide short and simple human readble language",
    });
    const responseThird = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-3.5-turbo-1106",
      tools: tools,
      tool_choice: "auto",
    });

    const responseNormal = responseThird.choices[0].message.content;
    console.log("3rd response", responseThird.choices[0].message.content);
    const resChat = await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: responseNormal },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USERNAME,
          "User-Secret": process.env.BOT_USERSCERET,
        },
      }
    );
    res.json({ message: responseNormal }); // Send a response.
    return;
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
