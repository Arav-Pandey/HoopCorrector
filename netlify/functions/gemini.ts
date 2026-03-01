import { GoogleGenAI } from "@google/genai";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    delete process.env.GOOGLE_GEMINI_BASE_URL;

    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Invalid method :(" }),
      };
    }

    if (!process.env.API_KEY_GEMINI) {
      console.log("GEMINI_API_KEY is missing");
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Missing GEMINI_API_KEY environment variable",
        }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid or missing body statement :(" }),
      };
    }

    console.log("Raw body:", event.body);

    const { text, listContext } = JSON.parse(event.body);

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid or not found TEXT variable. :(",
        }),
      };
    }

    const client = new GoogleGenAI({ apiKey: process.env.API_KEY_GEMINI });

    const response = await client.models.generateContent({
      model: "models/gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are a friendly, supportive coach.
Encourage the user, be clear and practical, and sound human.

Structure:
- Start with encouragement
- Share one insight
- Give clear next steps

Avoid robotic language.

User message:
${text}
          `,
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              text: `Additional context:\n${listContext?.join("\n") ?? "None"}`,
            },
          ],
        },
      ],
    });

    if (!response) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid response returned from Google Gemini SDK",
        }),
      };
    }

    const resText = response.text;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Successfully fetched!", resText }),
    };
  } catch (error) {
    console.log("Error internally: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error. :( " }),
    };
  }
};
