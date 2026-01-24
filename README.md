Real Estate Chatbot (AI-Powered)
A full-stack AI-powered real estate chatbot that collects user requirements through natural conversation and automatically stores lead data in Google Sheets using Make.com automation.

Live Demo:
https://real-estate-chatbot-three.vercel.app

GitHub Repository:
https://github.com/TanmayGiramkar/real-estate-chatbot

Features:
AI-powered conversational chatbot
2.Collects real estate requirements (name, phone, budget, location, property type)
3.Backend API deployed on Vercel
4.Webhook automation using Make.com
5.Automatically stores data in Google Sheets
6.Fully deployed frontend & backend (cloud-based)
7.Secure environment variables (API keys not exposed)

Tech Stack:
Frontend:
1.React (Create React App)
2.Axios
3.CSS
4.Deployed on Vercel

Backend:
1.Node.js
2.Express.js
3.OpenRouter / LLM API
4.CORS
5.Deployed on Vercel

Automation & Storage:
1.Make.com (Webhook automation)
2.Google Sheets (Data storage)

Project Structure:
real-estate-chatbot/
├── client/        # React frontend
│   ├── src/
│   │   └── components/ChatWidget.jsx
│   └── package.json
│
├── server/        # Node.js backend
│   ├── index.js
│   ├── vercel.json
│   └── package.json
│
├── .gitignore
└── README.md

How It Works (Flow):
1.User opens the website and chats with the AI bot
2.AI collects user details through conversation
3.When conversation is complete, user clicks Confirm & Submit
4.Frontend sends data to backend API
5.Backend triggers a Make.com webhook
6.Make.com stores the data into Google Sheets

Deployment:
Frontend:
1.Built using npm run build
2.Deployed on Vercel

Backend:
1.Serverless Node.js API
2.Deployed on Vercel
3.Environment variables configured securely

Environment Variables (Backend):
These variables are required in Vercel:

1.OPENROUTER_API_KEY=your_api_key
2.N8N_WEBHOOK_URL=your_make_webhook_url

These are not included in the repository for security reasons.

Live Testing:
1.Open the live site
2.Start a conversation with the chatbot
3.Complete the flow until <<<COMPLETE>>>
4.Click Confirm & Submit
5.Check Google Sheets → New row added 🎉

Use Cases:
1.College / academic project
2.Portfolio project
3.Real estate lead generation
4.AI + automation demo
5.Full-stack deployment example

Author:
Tanmay Giramkar
GitHub: https://github.com/TanmayGiramkar

License:
This project is for educational and demonstration purposes.

Next (Optional Improvements):
1.Authentication
2.Admin dashboard
3.Database integration (MongoDB / PostgreSQL)
4.Custom domain
5.UI animations
6.Analytics tracking
7.Database integration (MongoDB / PostgreSQL)
8.Custom domain

UI animations

Analytics tracking
