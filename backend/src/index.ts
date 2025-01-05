// // require("dotenv").config();
// // import express from "express";
// // import Anthropic from '@anthropic-ai/sdk';
// // import { BASE_PROMPT, getSystemPrompt } from "./prompts";
// // import { ContentBlock, TextBlock } from "@anthropic-ai/sdk/resources";
// // import {basePrompt as nodeBasePrompt} from "./defaults/node";
// // import {basePrompt as reactBasePrompt} from "./defaults/react";
// // import cors from "cors";

// // const anthropic = new Anthropic();
// // const app = express();
// // app.use(cors())
// // app.use(express.json())

// // app.post("/template", async (req, res) => {
// //     const prompt = req.body.prompt;
    
// //     const response = await anthropic.messages.create({
// //         messages: [{
// //             role: 'user', content: prompt
// //         }],
// //         model: 'claude-3-5-sonnet-20241022',
// //         max_tokens: 200,
// //         system: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"
// //     })

// //     const answer = (response.content[0] as TextBlock).text; // react or node
// //     if (answer == "react") {
// //         res.json({
// //             prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
// //             uiPrompts: [reactBasePrompt]
// //         })
// //         return;
// //     }

// //     if (answer === "node") {
// //         res.json({
// //             prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
// //             uiPrompts: [nodeBasePrompt]
// //         })
// //         return;
// //     }

// //     res.status(403).json({message: "You cant access this"})
// //     return;

// // });



// // app.post("/chat", async (req, res) => {
// //     const messages = req.body.messages;
// //     const response = await anthropic.messages.create({
// //         messages: messages,
// //         model: 'claude-3-5-sonnet-20241022',
// //         max_tokens: 8000,
// //         system: getSystemPrompt()
// //     })

// //     console.log(response);

// //     res.json({
// //         response: (response.content[0] as TextBlock)?.text
// //     });
// // })





// // app.listen(3000);


















// require("dotenv").config();
// import express from "express";
// import axios from "axios"; // Import axios for making HTTP requests
// import { BASE_PROMPT, getSystemPrompt } from "./prompts";
// import { basePrompt as nodeBasePrompt } from "./defaults/node";
// import { basePrompt as reactBasePrompt } from "./defaults/react";
// import cors from "cors";

// const app = express();
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow requests from this specific frontend
//   })
// );
// app.use(express.json());

// // Flask server URL (Ensure Flask server is running on this URL)
// const FLASK_SERVER_URL = "http://127.0.0.1:5050/generate";

// // Template endpoint
// app.post("/template", async (req, res) => {
//     const prompt = req.body.prompt;
  
//     try {
//       // First request to determine if the project is React or Node
//       const response = await axios.post(FLASK_SERVER_URL, {
//         prompt: `Is the project React or Node? Determine based on the following description return in just one word nothing else: ${prompt}`,
//       });
  
//       const data = response.data;
//       console.log("First response:", data);
  
//       const answer = data.response?.toLowerCase(); // Ensure Flask returns structured response
//       console.log("Project type:", answer);
  
//       if (!answer || (answer !== "react" && answer !== "node")) {
//         res.status(400).json({ message: "Invalid project type received" });
//         return;
//       }
  
//       // Proceed to the second request for detailed structure and recommendations
//       let basePrompt;
//       if (answer === "react") {
//         basePrompt = reactBasePrompt;
//       } else {
//         basePrompt = nodeBasePrompt;
//       }
  
//       // Second request to get detailed recommendations and structure based on the project type
//       const structureResponse = await axios.post(FLASK_SERVER_URL, {
//         prompt: `Provide the detailed structure  and complete code for a ${answer} project with the complete functionality of the project asked in this prompt: ${prompt}`,
//       });
  
//       const structureData = structureResponse.data;
//       console.log("Structure response:", structureData);
//       const projectStructure = structureData.response?.projectStructure;
//       if (!projectStructure) {
//         res.status(500).json({ message: "No project structure returned" });
//         return;
//       }
//       res.json({
//         prompts: [
//           BASE_PROMPT,
//           `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
//         ],
//         uiPrompts: [basePrompt],
//         projectCode: projectStructure
//       });
//       console.log("doneee");
//       return;
//     } catch (error) {
//       console.error("Error interacting with Flask server:", error);
//       res.status(500).json({
//         message: "Internal server error",
//         details: error,
//       });
//     }
//   });
  
  
// // Chat endpoint
// app.post("/chat", async (req, res) => {
//   const messages = req.body.messages;

//   try {
//     // Send the chat messages to Flask server
//     const response = await axios.post(FLASK_SERVER_URL, {
//       prompt: getSystemPrompt + "\n" + messages.join("\n"),
//     });

//     console.log("Chat response:", response.data);

//     res.json({
//       response: response.data.response, // Assuming the Flask server responds with a "response" field
//     });
//   } catch (error) {
//     console.error("Error interacting with Flask server:", error);
//     res.status(500).json({
//       message: "Internal server error",
//       details: error,
//     });
//   }
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
require("dotenv").config();
import express from "express";
import axios from "axios";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

const FLASK_SERVER_URL = "http://127.0.0.1:5050/generate";

// Helper function to make Flask API calls
async function callFlaskServer(prompt: string) {
  try {
    const response = await axios.post(FLASK_SERVER_URL, {
      prompt: prompt
    });
    return response.data;
  } catch (error) {
    console.error("Flask server error:", error);
    throw error;
  }
}

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    // First determine project type
    const projectTypeResponse = await callFlaskServer(
      `Is the project React or Node? Determine based on the following description return in just one word nothing else: ${prompt}`
    );

    const projectType = projectTypeResponse.response?.trim().toLowerCase();
    console.log("Project type:", projectType);

    if (!projectType || (projectType !== "react" && projectType !== "node")) {
      res.status(400).json({ message: "Invalid project type determined" });
      return;
    }

    // Get project structure based on type
    const basePrompt = projectType === "react" ? reactBasePrompt : nodeBasePrompt;
    const structureResponse = await callFlaskServer(
      `Provide the detailed structure and complete code for a ${projectType} project with the complete functionality of the project asked in this prompt: ${prompt}`
    );

    if (!structureResponse.response) {
      res.status(500).json({ message: "No project structure returned" });
      return;
    }

    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [basePrompt],
      projectCode: structureResponse.response
    });

  } catch (error) {
    console.error("Template endpoint error:", error);
    res.status(500).json({
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;
    
    if (!Array.isArray(messages)) {
      res.status(400).json({ message: "Messages must be an array" });
      return;
    }

    // Combine messages into a single prompt for Flask
    const combinedPrompt = messages.map(msg => 
      `${msg.role}: ${msg.content}`
    ).join("\n");

    const systemPromptStr = getSystemPrompt();
    const finalPrompt = `${systemPromptStr}\n\n${combinedPrompt}`;

    const response = await callFlaskServer(finalPrompt);

    res.json({
      response: response.response
    });

  } catch (error) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({
      message: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});