import { DEFAULT_OPENAI_MODEL } from "@/shared/Constants";
import { OpenAIModel } from "@/types/Model";
import * as dotenv from "dotenv";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

// Get your environment variables
dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body;
  const messages = (body?.messages || []) as ChatCompletionRequestMessage[];

  try {
    // Send last message to ChatMDR backend as request
    // and all other messages as history
    if (messages.length < 1)
    {
        res.status(500).json({ error: "No messages specified"});
    }
    
    const userMessage = messages[messages.length - 1].content;
    var chat_history = [];
    if (messages.length > 2)
    {
        // Compile history
        for (var i=0; i<messages.length - 1; i+=2)
        {
            // Push tuples of human requests and AI responses
            chat_history.push([messages[i].content, messages[i+1].content]);
        }
    }    

    const response = await fetch(`http://127.0.0.1:5000/`, {        // TODO: configurable
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: chat_history,
          message: userMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const responseMessage = data.response;

        if (!responseMessage) {
            res
            .status(400)
            .json({ error: "Unable get response from OpenAI. Please try again." });
        }

        res.status(200).json({ message: responseMessage });
    }
    else
    {
        res.status(500).json({
            error: "An error was returned from the ChatMDR backend server. Please try again.",
          });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during ping to ChatMDR backend server. Please try again.",
    });
  }
}
