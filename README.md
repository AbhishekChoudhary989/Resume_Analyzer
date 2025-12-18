# 🚀 AI CareerBoost | Intelligent Resume Analyzer

**AI CareerBoost** is a full-stack application designed to help job seekers optimize their resumes. It uses advanced Large Language Models (LLM) to compare resumes against specific job descriptions, simulating a real-world **ATS (Applicant Tracking System)** to provide scores, feedback, and improvement suggestions.

---

## ✨ Key Features

* **🔐 Secure Authentication:** Full Login/Signup system using JWT (JSON Web Tokens) and bcrypt password hashing.
* **📄 PDF Resume Parsing:** Automatically extracts text from uploaded PDF resumes.
* **🖼️ Thumbnail Generation:** Auto-generates image previews of the first page of the resume.
* **🤖 AI-Powered Analysis:** Uses **Groq (Llama 3)** to analyze keywords, structure, tone, and relevance.
* **🎯 Job Matching:** Compares the resume strictly against a specific Job Title and Description.
* **📊 Visual Dashboard:** Clean, modern UI to track history and view score breakdowns (Tone, Content, Skills).
* **🎨 Modern UI:** Glassmorphism design with responsive Tailwind CSS styling.

---

## 🛠️ Tech Stack

### **Frontend**

* **React (Vite):** Fast, component-based UI.
* **Tailwind CSS:** For styling and responsive design.
* **Lucide React:** Beautiful, consistent icons.
* **PDF.js:** For client-side PDF rendering and image conversion.

### **Backend**

* **Node.js & Express:** RESTful API server.
* **MongoDB & Mongoose:** NoSQL database for storing users and analysis results.
* **Groq SDK:** Interface for the Llama 3 AI model.
* **Multer:** For handling file uploads.
* **PDF-Parse:** Server-side text extraction.

---

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (v16 or higher)
2. **MongoDB** (Installed locally or have a MongoDB Atlas connection string)
3. **Git**

---

## 🚀 Installation & Setup Guide

Follow these steps to get the project running on your local machine.

### **Step 1: Clone the Repository**

Open your terminal and run:

```bash
git clone https://github.com/YOUR_USERNAME/resume-analyzer.git
cd resume-analyzer

```

---

### **Step 2: Backend Setup**

The backend handles the AI logic and database connection.

1. Navigate to the server folder:
```bash
cd server

```


2. Install dependencies:
```bash
npm install

```


3. **Create Environment Variables:**
Create a file named `.env` inside the `server/` folder and add the following keys:
```env
# Server Port
PORT=5000

# Database Connection (Use local or Atlas link)
MONGODB_URI=mongodb://127.0.0.1:27017/resume-analyzer

# Security Key for Login (Make this random)
JWT_SECRET=my_super_secret_key_123

# AI API Key (Get from https://console.groq.com/)
GROQ_API_KEY=gsk_your_groq_api_key_here

```


4. Start the Backend Server:
```bash
node index.js

```


*You should see: "✅ Connected to MongoDB" and "Server running on port 5000"*

---

### **Step 3: Frontend Setup**

The frontend is the visual interface.

1. Open a **new terminal** window (do not close the backend terminal).
2. Navigate to the project root:
```bash
cd resume-analyzer

```


3. Install dependencies:
```bash
npm install

```


4. Start the React App:
```bash
npm run dev

```


5. Open your browser and go to the link shown (usually `http://localhost:5173`).

---

## 📂 Project Structure

```text
resume-analyzer/
├── app/                  # Frontend Source Code (React)
│   ├── components/       # Reusable UI components (Navbar, Cards)
│   ├── routes/           # Pages (Home, Upload, Login)
│   ├── lib/              # Utilities (PDF converter)
│   └── root.tsx          # Main entry point
├── server/               # Backend Source Code (Node/Express)
│   ├── models/           # Database Schemas (User, Resume)
│   ├── routes/           # API Endpoints (Auth, AI, Upload)
│   ├── uploads/          # Folder where PDF files are stored
│   ├── .env              # Secrets (You create this)
│   └── index.js          # Server entry point
├── package.json          # Frontend dependencies
└── README.md             # This file

```

---

## 🛡️ Security Best Practices

* **Never commit the `.env` file.** It is included in `.gitignore` to prevent leaking your API keys.
* **Passwords are hashed** using `bcryptjs` before being stored in the database.
* **Routes are protected** using JWT verification middleware.

---

## 📸 Screenshots

*(You can add screenshots of your project here by placing images in a folder and linking them)*

| Login Page | Dashboard | Analysis Result |
| --- | --- | --- |
|  |  |  |

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

### 💡 Troubleshooting

* **"MongoNetworkError"**: Make sure your MongoDB service is running locally (`mongod`) or your Atlas URI is correct.
* **"AI Analysis Failed"**: Check your terminal for the backend log. Ensure your `GROQ_API_KEY` is valid.
* **"Upload Failed"**: Ensure the `server/uploads` folder exists. If not, create it manually.
