UniVox AI
Speak freely. Understand everyone.
UniVox AI is a multilingual communication platform designed to help people communicate across language barriers.
It combines translation, voice input, spoken translation, real-time conversation, conversation memory, and AI-powered context understanding.
Breaking language barriers, one conversation at a time.
Creator
Akshar Parashar
Age: 13
Class: 6
Role: Creator & Developer
Project: UniVox AI
UniVox AI is an independent project created and developed by Akshar Parashar to explore artificial intelligence, multilingual communication, voice technology, translation, and accessible communication.
Features
Multilingual Translation
UniVox AI supports:
Hindi
Bengali
Sanskrit
Japanese
Korean
Chinese
French
Spanish
German
English
Voice Input
Speak instead of typing using browser speech-recognition technology.
Spoken Translation
Translated text can be spoken aloud using supported voices on the device or browser.
Any-to-Any Translation
UniVox AI can translate between different supported languages.
Examples:
Hindi → English
English → Hindi
Japanese → French
French → Japanese
German → Spanish
Spanish → German
Translator Mode
Translator Mode is designed for individual translations.
Users can:
Select the source language.
Select the target language.
Type a message or use voice input.
Translate the message.
Read the result.
Listen to the translated result.
Conversation Mode
Conversation Mode is designed for two people communicating in different languages.
Currently, Conversation Mode focuses on:
Hindi ↔ English
The basic flow is:
Person A speaks
        ↓
Speech recognition
        ↓
Translation
        ↓
Spoken output
        ↓
Person B hears it
        ↓
Person B speaks
        ↓
Translation
        ↓
Spoken output
Conversation Memory
UniVox AI includes a conversation-memory system.
Recent messages are stored so the AI layer can access previous conversation information.
For example:
Person A:
Where is the railway station?

Person B:
It is 2 km from here.
The conversation history helps UniVox understand what previous messages were about.
AI Conversation Understanding
UniVox AI is being developed with an AI-powered context layer.
The goal is to understand references to previous parts of a conversation.
For example:
Person A:
Where is the railway station?

Person B:
It is 2 km from here.
The AI can use the previous conversation to understand what words such as "it" may refer to.
This helps move UniVox beyond simple sentence-by-sentence translation toward more natural communication.
Technology
UniVox AI currently uses:
HTML
CSS
JavaScript
Node.js
Browser Speech Recognition
Browser Speech Synthesis
MyMemory Translation API
Gemini API
REST APIs
JSON
Project Architecture
                    UNI VOX AI
                        │
          ┌─────────────┴─────────────┐
          │                           │
     Translator Mode           Conversation Mode
          │                           │
     Text / Voice                Voice Input
          │                           │
          ▼                           ▼
   Translation API              Speech Recognition
          │                           │
          ▼                           ▼
    Translated Text             Conversation Memory
          │                           │
          ▼                           ▼
    Spoken Output              AI Context Layer
                                      │
                                      ▼
                               Translation
                                      │
                                      ▼
                               Spoken Output
Development Roadmap
UniVox AI follows this version system:
10 Steps = 1 Version
Therefore:
Steps 1–10   → V1
Steps 11–20  → V2
Steps 21–30  → V3
V1 — Foundation
Steps 1–10
[x] Step 1 — Initial project
[x] Step 2 — Translation foundation
[x] Step 3 — Web interface
[x] Step 4 — Website deployment
[x] Step 5 — Professional interface
[x] Step 6 — Voice input
[x] Step 7 — Multilingual expansion
[x] Step 7.1 — UI upgrade
[x] Step 8 — Any-to-any translation
[x] Step 8.1 — Professional UI upgrade
[x] Step 9 — Multilingual voice system
[x] Step 10 — Conversation Mode
V1 Result
UniVox AI became a multilingual translator with voice capabilities and Conversation Mode.
V2 — Intelligent Communication
Steps 11–20
[x] Step 11 — Conversation Memory
[ ] Step 12 — AI Conversation Understanding
[ ] Step 12.1 — UI Upgrade
[ ] Step 13 — Planned
[ ] Step 13.1 — UI Upgrade
[ ] Step 14 — Planned
[ ] Step 14.1 — UI Upgrade
[ ] Step 15 — Planned
[ ] Step 15.1 — UI Upgrade
[ ] Step 16 — Planned
[ ] Step 16.1 — UI Upgrade
[ ] Step 17 — Planned
[ ] Step 17.1 — UI Upgrade
[ ] Step 18 — Planned
[ ] Step 18.1 — UI Upgrade
[ ] Step 19 — Planned
[ ] Step 19.1 — UI Upgrade
[ ] Step 20 — Planned
Future Vision
More Languages
Support for many more languages and language combinations.
Better Real-Time Conversations
Faster and more natural conversations with improved speech recognition and translation.
Advanced AI Context
Future versions may understand:
Previous messages
Conversation topics
References
Speaker context
Natural conversational language
Travel Communication
Possible applications include:
Airports
Railway stations
Hotels
Tourist locations
International travel
Sign Language
A long-term goal is to explore sign-language communication.
Possible future direction:
Speech
  ↓
Text
  ↓
Translation
  ↓
Sign-language representation
Screenshots
Screenshots can be added to:
screenshots/
Recommended files:
screenshots/
├── home.png
├── translator-mode.png
├── conversation-mode.png
├── conversation-memory.png
└── ai-context.png
Installation
Requirements
You need:
Node.js
A modern web browser
Internet connection
Microphone permission for voice features
1. Clone the repository
git clone https://github.com/YOUR-USERNAME/UniVox-AI.git
Then:
cd UniVox-AI
Replace YOUR-USERNAME with your GitHub username.
2. Check Node.js
node --version
3. Configure Gemini AI
AI Conversation Understanding requires a Gemini API key.
Never put your API key inside GitHub.
Do not put it inside:
index.html
script.js
README.md
Configure it as a server environment variable:
GEMINI_API_KEY=YOUR_API_KEY
4. Start the server
node server.js
Then open the local address shown by the server.
Project Structure
UniVox-AI/
│
├── index.html
├── style.css
├── script.js
├── server.js
├── README.md
│
├── screenshots/
│   ├── home.png
│   ├── translator-mode.png
│   ├── conversation-mode.png
│   ├── conversation-memory.png
│   └── ai-context.png
│
└── versions/
    ├── V1/
    └── V2/
Security
API keys are private credentials.
Never upload:
API keys
Passwords
Private tokens
Secret credentials
If an API key is accidentally exposed:
Revoke the key.
Generate a new key.
Remove the old key from the project.
Testing
UniVox AI is developed and tested step-by-step.
Testing includes:
Text translation
Language selection
Language swapping
Voice input
Voice output
Conversation Mode
Conversation Memory
AI context processing
Mobile layout
Desktop layout
Development Philosophy
UniVox AI follows this development cycle:
New Feature
     ↓
UI Upgrade
     ↓
New Feature
     ↓
UI Upgrade
     ↓
Repeat
This keeps the project growing while maintaining a professional interface.
Current Project Status
Project: UniVox AI
Current Version: V2
Current Step: Step 12
Development Status: Active Development
Creator: Akshar Parashar
Age: 13
Class: 6
Long-Term Goal
One world. Many languages. One conversation.
UniVox AI aims to make language differences less of a barrier to human communication.
The long-term vision combines:
Language
   +
Voice
   +
Translation
   +
Artificial Intelligence
   +
Conversation
   +
Accessibility
into one communication platform.
About the Creator
Akshar Parashar is a student developer creating UniVox AI as an independent technology project.
The project explores:
Artificial Intelligence
Language Technology
Translation
Voice Technology
Web Development
Accessibility
Future Sign-Language Technology
UniVox AI is being developed step-by-step while learning new technologies.
Support the Project
If you find UniVox AI interesting:
Star the repository
Follow the project
Test new versions
Suggest improvements
Report bugs
Share the project
UniVox AI
Speak freely. Understand everyone.
Breaking language barriers, one conversation at a time.
