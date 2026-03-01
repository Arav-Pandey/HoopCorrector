import { InferenceHTTPClient } from "@roboflow/inference-sdk";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  if (!process.env.ROBOFLOW_API_KEY) {
    console.error("Missing Roboflow API key");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error: Missing Roboflow API key" }),
    };
  }

  if (event.body === null) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Bad Request: Missing body" }),
    };
  }

  try {
    const { offer, wrtcParams } = JSON.parse(event?.body);

    const client = InferenceHTTPClient.init({
      apiKey: process.env.ROBOFLOW_API_KEY,
    });

    const answer = await client.initializeWebrtcWorker({
      offer,
      workspaceName: wrtcParams.workspaceName,
      workflowId: wrtcParams.workflowId,
      config: {
        streamOutputNames: wrtcParams.streamOutputNames,
        dataOutputNames: wrtcParams.dataOutputNames,
        workflowsParameters: wrtcParams.workflowsParameters,
        requestedPlan: wrtcParams.requestedPlan,
        requestedRegion: wrtcParams.requestedRegion,
        realtimeProcessing: wrtcParams.realtimeProcessing,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify(answer),
    };
  } catch (err) {
    console.error("Error processing request:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: (err as Error).message,
      }),
    };
  }
};
