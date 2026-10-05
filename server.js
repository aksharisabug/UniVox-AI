const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

let conversationMemory = [];
const MAX_MEMORY = 20;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};


/* =========================
   JSON RESPONSE
========================= */

function sendJSON(response, status, data) {

  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
  });

  response.end(
    JSON.stringify(data)
  );
}


/* =========================
   READ REQUEST BODY
========================= */

function readBody(request) {

  return new Promise(
    (resolve, reject) => {

      let body = "";

      request.on(
        "data",
        chunk => {
          body += chunk.toString();
        }
      );

      request.on(
        "end",
        () => {

          if (!body) {
            resolve({});
            return;
          }

          try {

            resolve(
              JSON.parse(body)
            );

          } catch (error) {

            reject(error);

          }

        }
      );

      request.on(
        "error",
        reject
      );

    }
  );

}


/* =========================
   BUILD CONVERSATION CONTEXT
========================= */

function buildContext() {

  return conversationMemory
    .map(
      (message, index) => {

        return (
          `${index + 1}. ` +
          `${message.sourceLanguage}: ` +
          `${message.sourceText} ` +
          `-> ` +
          `${message.targetLanguage}: ` +
          `${message.translatedText}`
        );

      }
    )
    .join("\n");

}


/* =========================
   MEMORY + AI API
========================= */

async function handleAPI(
  request,
  response,
  url
) {


  /* GET MEMORY */

  if (
    request.method === "GET" &&
    url === "/api/memory/context"
  ) {

    return sendJSON(
      response,
      200,
      {
        success: true,
        messages: conversationMemory,
        context: buildContext(),
        count: conversationMemory.length
      }
    );

  }


  /* CLEAR MEMORY */

  if (
    request.method === "POST" &&
    url === "/api/memory/clear"
  ) {

    conversationMemory = [];

    return sendJSON(
      response,
      200,
      {
        success: true,
        messages: [],
        context: ""
      }
    );

  }


  /* SAVE MESSAGE */

  if (
    request.method === "POST" &&
    url === "/api/memory/message"
  ) {

    try {

      const body =
        await readBody(request);


      if (
        !body.sourceLanguage ||
        !body.sourceText ||
        !body.targetLanguage ||
        !body.translatedText
      ) {

        return sendJSON(
          response,
          400,
          {
            success: false,
            error:
              "Incomplete conversation message."
          }
        );

      }


      const message = {

        id: Date.now(),

        sourceLanguage:
          body.sourceLanguage,

        sourceText:
          body.sourceText,

        targetLanguage:
          body.targetLanguage,

        translatedText:
          body.translatedText,

        timestamp:
          new Date().toISOString()

      };


      conversationMemory.push(
        message
      );


      if (
        conversationMemory.length >
        MAX_MEMORY
      ) {

        conversationMemory.shift();

      }


      return sendJSON(
        response,
        200,
        {
          success: true,
          message,
          messages:
            conversationMemory,
          context:
            buildContext(),
          count:
            conversationMemory.length
        }
      );


    } catch (error) {

      return sendJSON(
        response,
        400,
        {
          success: false,
          error:
            "Invalid JSON."
        }
      );

    }

  }


  /* =========================
     GEMINI AI CONTEXT
  ========================== */

  if (
    request.method === "POST" &&
    url === "/api/ai/context"
  ) {

    try {

      const body =
        await readBody(request);


      /*
        IMPORTANT:
        The API key is read from the
        server environment.

        NEVER put the API key inside
        script.js or index.html.
      */

      const apiKey =
        process.env.GEMINI_API_KEY;


      if (!apiKey) {

        return sendJSON(
          response,
          503,
          {
            success: false,
            aiAvailable: false,
            error:
              "Gemini API key is not configured.",
            context:
              buildContext()
          }
        );

      }


      const context =
        buildContext();


      const currentText =
        body.text || "";


      const targetLanguage =
        body.targetLanguage ||
        "English";


      /*
        Gemini receives the previous
        conversation plus the new sentence.
      */

      const prompt =
        `Conversation history:\n` +
        `${context || "(none)"}\n\n` +

        `Current sentence:\n` +
        `${currentText}\n\n` +

        `Target language:\n` +
        `${targetLanguage}`;


      const aiRequest = {

        system_instruction: {

          parts: [

            {
              text:
                "You are UniVox's conversation " +
                "understanding assistant. " +

                "Use the supplied conversation " +
                "history to understand references " +
                "such as it, that, there, they, " +
                "and previous topics. " +

                "Return ONLY the improved " +
                "translation or rewritten " +
                "target-language sentence. " +

                "Do not explain your reasoning. " +

                "Do not add quotation marks. " +

                "Do not add labels."

            }

          ]

        },


        contents: [

          {

            role: "user",

            parts: [

              {
                text: prompt
              }

            ]

          }

        ]

      };


      /*
        Gemini API request
      */

      const geminiResponse =
        await fetch(

          "https://generativelanguage.googleapis.com/" +
          "v1beta/models/gemini-2.5-flash:generateContent" +
          "?key=" +
          encodeURIComponent(apiKey),

          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body:
              JSON.stringify(
                aiRequest
              )

          }

        );


      const data =
        await geminiResponse.json();


      if (!geminiResponse.ok) {

        console.error(
          "Gemini error:",
          data
        );


        return sendJSON(
          response,
          geminiResponse.status,
          {
            success: false,
            aiAvailable: true,
            error:
              data?.error?.message ||
              "Gemini request failed."
          }
        );

      }


      const result =
        data
          ?.candidates?.[0]
          ?.content?.parts?.[0]
          ?.text
          ?.trim();


      if (!result) {

        return sendJSON(
          response,
          502,
          {
            success: false,
            aiAvailable: true,
            error:
              "Gemini returned no usable text."
          }
        );

      }


      return sendJSON(
        response,
        200,
        {
          success: true,
          aiAvailable: true,
          result
        }
      );


    } catch (error) {

      console.error(
        "AI context error:",
        error
      );


      return sendJSON(
        response,
        500,
        {
          success: false,
          aiAvailable: true,
          error:
            "AI context processing failed."
        }
      );

    }

  }


  /* UNKNOWN API */

  return sendJSON(
    response,
    404,
    {
      success: false,
      error:
        "API endpoint not found."
    }
  );

}


/* =========================
   STATIC FILE SERVER
========================= */

function serveStaticFile(
  request,
  response,
  url
) {

  let requestedPath =
    url === "/"
      ? "/index.html"
      : url;


  requestedPath =
    requestedPath.split("?")[0];


  const filePath =
    path.join(
      ROOT,
      requestedPath
    );


  const safeRoot =
    path.resolve(ROOT);


  const safeFile =
    path.resolve(filePath);


  if (
    !safeFile.startsWith(
      safeRoot
    )
  ) {

    response.writeHead(403);

    response.end(
      "Forbidden"
    );

    return;

  }


  fs.readFile(
    safeFile,
    (error, data) => {

      if (error) {

        response.writeHead(404);

        response.end(
          "File not found"
        );

        return;

      }


      const extension =
        path.extname(
          safeFile
        );


      response.writeHead(
        200,
        {
          "Content-Type":
            mimeTypes[extension] ||
            "application/octet-stream"
        }
      );


      response.end(data);

    }
  );

}


/* =========================
   SERVER
========================= */

const server =
  http.createServer(
    async (
      request,
      response
    ) => {


      const url =
        new URL(
          request.url,
          `http://${request.headers.host}`
        );


      /* CORS */

      if (
        request.method ===
        "OPTIONS"
      ) {

        response.writeHead(
          204,
          {
            "Access-Control-Allow-Origin":
              "*",

            "Access-Control-Allow-Headers":
              "Content-Type",

            "Access-Control-Allow-Methods":
              "GET,POST,OPTIONS"
          }
        );

        response.end();

        return;

      }


      /* API */

      if (
        url.pathname.startsWith(
          "/api/"
        )
      ) {

        await handleAPI(
          request,
          response,
          url.pathname
        );

        return;

      }


      /* WEBSITE */

      serveStaticFile(
        request,
        response,
        url.pathname
      );

    }
  );


server.listen(
  PORT,
  () => {

    console.log(
      `UniVox V2 running on port ${PORT}`
    );


    console.log(
      process.env.GEMINI_API_KEY
        ? "Gemini AI context is enabled."
        : "Gemini AI context is not configured."
    );

  }
);
