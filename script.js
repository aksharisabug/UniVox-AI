const translatorModeBtn =
  document.getElementById("translatorModeBtn");

const conversationModeBtn =
  document.getElementById("conversationModeBtn");

const translatorPanel =
  document.getElementById("translatorPanel");

const conversationPanel =
  document.getElementById("conversationPanel");


const fromLanguage =
  document.getElementById("fromLanguage");

const toLanguage =
  document.getElementById("toLanguage");

const swapBtn =
  document.getElementById("swapBtn");

const inputText =
  document.getElementById("inputText");

const outputText =
  document.getElementById("outputText");

const inputTitle =
  document.getElementById("inputTitle");

const outputTitle =
  document.getElementById("outputTitle");

const translateBtn =
  document.getElementById("translateBtn");

const voiceBtn =
  document.getElementById("voiceBtn");

const speakBtn =
  document.getElementById("speakBtn");

const stopBtn =
  document.getElementById("stopBtn");


const conversationFrom =
  document.getElementById("conversationFrom");

const conversationTo =
  document.getElementById("conversationTo");

const conversationStatus =
  document.getElementById("conversationStatus");

const conversationLog =
  document.getElementById("conversationLog");

const startConversationBtn =
  document.getElementById("startConversationBtn");

const stopConversationBtn =
  document.getElementById("stopConversationBtn");


/* LANGUAGE NAMES */

const languageNames = {
  hi: "Hindi",
  bn: "Bengali",
  sa: "Sanskrit",
  ja: "Japanese",
  ko: "Korean",
  "zh-CN": "Chinese",
  fr: "French",
  es: "Spanish",
  de: "German",
  en: "English"
};


/* SPEECH LANGUAGES */

const speechLanguages = {
  hi: "hi-IN",
  bn: "bn-IN",
  sa: "sa-IN",
  ja: "ja-JP",
  ko: "ko-KR",
  "zh-CN": "zh-CN",
  fr: "fr-FR",
  es: "es-ES",
  de: "de-DE",
  en: "en-US"
};


/* =========================
   MODE SWITCHING
========================= */

translatorModeBtn.addEventListener(
  "click",
  () => {

    translatorModeBtn.classList.add("active");
    conversationModeBtn.classList.remove("active");

    translatorPanel.classList.remove("hidden");
    conversationPanel.classList.add("hidden");

  }
);


conversationModeBtn.addEventListener(
  "click",
  () => {

    conversationModeBtn.classList.add("active");
    translatorModeBtn.classList.remove("active");

    conversationPanel.classList.remove("hidden");
    translatorPanel.classList.add("hidden");

  }
);


/* =========================
   LANGUAGE TITLES
========================= */

function updateTranslatorTitles() {

  inputTitle.textContent =
    languageNames[fromLanguage.value];

  outputTitle.textContent =
    languageNames[toLanguage.value];

}


fromLanguage.addEventListener(
  "change",
  updateTranslatorTitles
);

toLanguage.addEventListener(
  "change",
  updateTranslatorTitles
);

updateTranslatorTitles();


/* =========================
   SWAP LANGUAGES
========================= */

swapBtn.addEventListener(
  "click",
  () => {

    const oldFrom =
      fromLanguage.value;

    fromLanguage.value =
      toLanguage.value;

    toLanguage.value =
      oldFrom;

    updateTranslatorTitles();

  }
);


/* =========================
   VOICE INPUT
========================= */

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

  recognition =
    new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener(
    "click",
    () => {

      recognition.lang =
        speechLanguages[fromLanguage.value] ||
        "en-US";

      try {

        recognition.start();

        voiceBtn.textContent =
          "Listening...";

      } catch (error) {

        console.error(error);

      }

    }
  );


  recognition.onresult =
    (event) => {

      const transcript =
        event.results[0][0].transcript;

      inputText.value =
        transcript;

      voiceBtn.textContent =
        "Speak";

    };


  recognition.onerror =
    (event) => {

      console.error(
        "Voice recognition error:",
        event.error
      );

      voiceBtn.textContent =
        "Speak";

    };


  recognition.onend =
    () => {

      voiceBtn.textContent =
        "Speak";

    };

} else {

  voiceBtn.disabled = true;

  voiceBtn.textContent =
    "Voice not supported";

}


/* =========================
   MYMEMORY TRANSLATION
========================= */

async function translateWithMyMemory(
  text,
  sourceLanguage,
  targetLanguage
) {

  const url =
    "https://api.mymemory.translated.net/get?q=" +
    encodeURIComponent(text) +
    "&langpair=" +
    encodeURIComponent(
      sourceLanguage + "|" + targetLanguage
    );

  const response =
    await fetch(url);

  if (!response.ok) {
    throw new Error(
      "Translation service error."
    );
  }

  const data =
    await response.json();

  const result =
    data?.responseData?.translatedText;

  if (!result) {
    throw new Error(
      "No translation returned."
    );
  }

  return result;

}


/* =========================
   TRANSLATOR MODE
========================= */

translateBtn.addEventListener(
  "click",
  async () => {

    const text =
      inputText.value.trim();

    const source =
      fromLanguage.value;

    const target =
      toLanguage.value;


    if (!text) {

      outputText.textContent =
        "Please enter or speak some text first.";

      return;

    }


    if (source === target) {

      outputText.textContent =
        "Please select two different languages.";

      return;

    }


    translateBtn.disabled = true;

    translateBtn.innerHTML =
      "<span>Translating...</span>";

    outputText.textContent =
      "Translating your message...";


    try {

      const result =
        await translateWithMyMemory(
          text,
          source,
          target
        );

      outputText.textContent =
        result;

    } catch (error) {

      console.error(error);

      outputText.textContent =
        "Translation failed. Please try again.";

    }


    translateBtn.disabled = false;

    translateBtn.innerHTML =
      '<span>Translate</span>' +
      '<span class="button-arrow">→</span>';

  }
);


/* =========================
   SPEECH OUTPUT
========================= */

function speakText(
  text,
  languageCode
) {

  if (!text) return;

  if (!("speechSynthesis" in window)) {

    console.error(
      "Speech synthesis not supported."
    );

    return;

  }


  speechSynthesis.cancel();


  const speech =
    new SpeechSynthesisUtterance(text);

  speech.lang =
    speechLanguages[languageCode] ||
    "en-US";

  speech.rate = 1;
  speech.pitch = 1;


  speechSynthesis.speak(speech);

}


speakBtn.addEventListener(
  "click",
  () => {

    const text =
      outputText.textContent.trim();

    if (
      !text ||
      text ===
        "Your translation will appear here." ||
      text.includes("Translation failed") ||
      text.includes("Translating")
    ) {
      return;
    }

    speakText(
      text,
      toLanguage.value
    );

  }
);


stopBtn.addEventListener(
  "click",
  () => {

    speechSynthesis.cancel();

  }
);


/* =========================
   CONVERSATION MEMORY
========================= */

let conversationMemory = [];


async function getMemory() {

  try {

    const response =
      await fetch(
        "/api/memory/context"
      );

    if (!response.ok) {
      return [];
    }

    const data =
      await response.json();

    conversationMemory =
      data.messages || [];

    return conversationMemory;

  } catch (error) {

    console.warn(
      "Memory unavailable:",
      error
    );

    return [];

  }

}


/* =========================
   AI CONTEXT
========================= */

async function getAIContextTranslation(
  text,
  targetLanguage
) {

  try {

    const response =
      await fetch(
        "/api/ai/context",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            text,
            targetLanguage
          })

        }
      );


    if (!response.ok) {
      return null;
    }


    const data =
      await response.json();


    if (
      data.success &&
      data.result
    ) {

      return data.result;

    }

  } catch (error) {

    console.warn(
      "AI context unavailable:",
      error
    );

  }


  return null;

}


/* =========================
   SAVE MEMORY
========================= */

async function saveConversationMessage(
  sourceLanguage,
  sourceText,
  targetLanguage,
  translatedText
) {

  try {

    const response =
      await fetch(
        "/api/memory/message",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            sourceLanguage,
            sourceText,

            targetLanguage,
            translatedText

          })

        }
      );


    if (response.ok) {

      const data =
        await response.json();

      conversationMemory =
        data.messages || [];

    }

  } catch (error) {

    console.warn(
      "Could not save memory:",
      error
    );

  }

}


/* =========================
   CONVERSATION STATE
========================= */

let conversationRunning =
  false;

let conversationBusy =
  false;

let conversationRecognition =
  null;


/* =========================
   CONVERSATION LOG
========================= */

function clearConversationLog() {

  conversationLog.innerHTML =
    "";

}


function addConversationMessage(
  person,
  sourceText,
  translatedText,
  aiUsed = false
) {

  const empty =
    conversationLog.querySelector(
      ".empty-conversation"
    );

  if (empty) {
    empty.remove();
  }


  const message =
    document.createElement("div");

  message.className =
    "conversation-message " +
    (person === "A" ? "a" : "b");


  const label =
    document.createElement("div");

  label.className =
    "message-label";

  label.textContent =
    "Person " + person;


  const source =
    document.createElement("div");

  source.className =
    "message-source";

  source.textContent =
    sourceText;


  const translation =
    document.createElement("div");

  translation.className =
    "message-translation";

  translation.textContent =
    translatedText;


  message.appendChild(label);
  message.appendChild(source);
  message.appendChild(translation);


  if (aiUsed) {

    const aiLabel =
      document.createElement("div");

    aiLabel.className =
      "message-source";

    aiLabel.textContent =
      "AI context";

    message.appendChild(aiLabel);

  }


  conversationLog.appendChild(
    message
  );


  conversationLog.scrollTop =
    conversationLog.scrollHeight;

}


/* =========================
   CONVERSATION RECOGNITION
========================= */

function createConversationRecognition() {

  if (!SpeechRecognition) {

    conversationStatus.textContent =
      "Voice recognition is not supported.";

    return null;

  }


  const r =
    new SpeechRecognition();

  r.continuous = false;
  r.interimResults = false;


  r.onresult =
    async (event) => {

      const text =
        event.results[0][0].transcript.trim();

      if (!text) {

        continueConversation();

        return;

      }


      await processConversationTurn(
        text
      );

    };


  r.onerror =
    (event) => {

      console.warn(
        "Conversation recognition error:",
        event.error
      );


      if (
        conversationRunning
      ) {

        setTimeout(
          continueConversation,
          500
        );

      }

    };


  r.onend =
    () => {

      if (
        conversationRunning &&
        !conversationBusy
      ) {

        setTimeout(
          continueConversation,
          350
        );

      }

    };


  return r;

}


/* =========================
   PROCESS CONVERSATION TURN
========================= */

async function processConversationTurn(
  text
) {

  if (conversationBusy) {
    return;
  }

  conversationBusy = true;


  const sourceLanguage =
    conversationFrom.value;

  const targetLanguage =
    conversationTo.value;


  conversationStatus.textContent =
    "Understanding your message...";


  let translatedText =
    null;

  let aiUsed =
    false;


  /*
    STEP 12:
    Ask Gemini to understand
    the conversation first.
  */

  translatedText =
    await getAIContextTranslation(
      text,
      targetLanguage
    );


  if (translatedText) {

    aiUsed = true;

  }


  /*
    Fallback:
    MyMemory still works if AI
    is unavailable.
  */

  if (!translatedText) {

    conversationStatus.textContent =
      "Translating...";

    try {

      translatedText =
        await translateWithMyMemory(
          text,
          sourceLanguage,
          targetLanguage
        );

    } catch (error) {

      console.error(error);

      conversationStatus.textContent =
        "Translation failed.";

      conversationBusy = false;

      setTimeout(
        continueConversation,
        700
      );

      return;

    }

  }


  addConversationMessage(
    sourceLanguage ===
      conversationFrom.value
      ? "A"
      : "B",

    text,

    translatedText,

    aiUsed
  );


  await saveConversationMessage(
    sourceLanguage,
    text,
    targetLanguage,
    translatedText
  );


  conversationStatus.textContent =
    "Speaking...";


  speakText(
    translatedText,
    targetLanguage
  );


  conversationBusy = false;


  /*
    Wait briefly after speech,
    then listen again.
  */

  setTimeout(
    continueConversation,
    900
  );

}


/* =========================
   CONTINUE CONVERSATION
========================= */

function continueConversation() {

  if (!conversationRunning) {
    return;
  }


  if (conversationBusy) {
    return;
  }


  if (!conversationRecognition) {

    conversationRecognition =
      createConversationRecognition();

  }


  if (!conversationRecognition) {
    return;
  }


  const currentLanguage =
    conversationFrom.value;


  conversationRecognition.lang =
    speechLanguages[currentLanguage] ||
    "en-US";


  conversationStatus.textContent =
    "Listening...";


  try {

    conversationRecognition.start();

  } catch (error) {

    setTimeout(
      () => {

        if (conversationRunning) {
          continueConversation();
        }

      },
      500
    );

  }

}


/* =========================
   START CONVERSATION
========================= */

startConversationBtn.addEventListener(
  "click",
  async () => {

    if (conversationRunning) {
      return;
    }


    if (
      conversationFrom.value ===
      conversationTo.value
    ) {

      conversationStatus.textContent =
        "Please choose two different languages.";

      return;

    }


    conversationRunning = true;

    conversationBusy = false;


    clearConversationLog();

    await getMemory();


    startConversationBtn.disabled =
      true;

    stopConversationBtn.disabled =
      false;


    conversationFrom.disabled =
      true;

    conversationTo.disabled =
      true;


    conversationStatus.textContent =
      "Starting conversation...";


    conversationRecognition =
      createConversationRecognition();


    setTimeout(
      continueConversation,
      500
    );

  }
);


/* =========================
   STOP CONVERSATION
========================= */

stopConversationBtn.addEventListener(
  "click",
  () => {

    conversationRunning =
      false;

    conversationBusy =
      false;


    if (
      conversationRecognition
    ) {

      try {

        conversationRecognition.stop();

      } catch (error) {}

    }


    speechSynthesis.cancel();


    startConversationBtn.disabled =
      false;

    stopConversationBtn.disabled =
      true;


    conversationFrom.disabled =
      false;

    conversationTo.disabled =
      false;


    conversationStatus.textContent =
      "Conversation stopped.";

  }
);
