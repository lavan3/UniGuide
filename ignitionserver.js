
// Ignition Hacks v6
// Basic Deno server for serving static web pages
// run using command: deno run --allow-read --allow-net --allow-env ignitionserver.js
// Requires having the GROQ_API_KEY environment variable bound in shell

import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const status_NOT_FOUND = 404;
const status_OK = 200;
const status_NOT_IMPLEMENTED = 501;

// groq API implementation how-to: https://console.groq.com/docs/quickstart
async function getGroqChatCompletion(userInput) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: userInput, // customize this based on user-input
      },
    ],
    model: "openai/gpt-oss-20b",
  });
}

async function retrieveFileData(path) {
    var contents, status, contentType;
    
    try {
        contents = await Deno.readFile("./" + path);
        status = status_OK;
        contentType = "text/html"; // temporary placeholder-- might not be necessary
    } catch (error) {
        contents = `<html>
                    <head>
                    <title>Page not found</title>
                    </head>
                    <body>
                    <h1>Page not found</h1>
                    </body>`;
        status = status_NOT_FOUND;
        contentType = "text/html";
    }
    
    return { contents, status, contentType };
}

async function route(request, path) {
    if (request.method === "GET") {
        if (path === "/") {
            path = "/index.html";
        }

        var response = await retrieveFileData(path);

        return response;

    } else if (request.method === "POST") {
        if (path === "/sendPrompt") {
            var body = await request.formData();
            var input = body.get("aiprompt");
            var contentInit = "";
            // console.log(input);
            const chatCompletion = await getGroqChatCompletion(input);
            // Print the completion to console -- need to change this into response that gets returned to user
            // console.log(chatCompletion.choices[0]?.message?.content || "");
            // console.log(chatCompletion); // test
            if (chatCompletion.choices[0]?.message?.content) {
                contentInit = chatCompletion.choices[0]?.message?.content.replace(/[^a-zA-Z0-9*.:|,\- \n]/g, "_");
            }
            
            return {
            contents: contentInit,
            status: status_OK,
            contentType: "text/plain"
            };
            
        }        

    } else {
        return {
            contents: "Unable to implement method.",
            status: status_NOT_IMPLEMENTED,
            contentType: "text/plain"
        };
    }
}

async function handler(request) {
    var originalPath = new URL(request.url).pathname;
    var path = originalPath;
    var response = await route(request, path);

    console.log(`${response.status} ${request.method} ${originalPath} ${path}`); 

    return new Response(response.contents, {status: 
                                        response.status,
                                        headers: {
                                            "content-type": response.contentType
                                        }
                                    }
    );
}

Deno.serve(handler);