
# 🕵️‍♂️ ScamSherlock - Cybercrime Intelligence Terminal

![Status](https://img.shields.io/badge/Status-Beta-FF3366?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-React_|_TypeScript_|_Python_|_Gemini-FFB800?style=for-the-badge)
![Theme](https://img.shields.io/badge/Theme-Urban_Noir-000000?style=for-the-badge&logo=hack-the-box&logoColor=white)

> *"The first line of defense in a digital war."*

**ScamSherlock** is a high-fidelity, gamified cyber-intelligence platform designed to empower users to detect, analyze, and report scam activity. Wrapped in a premium "Urban Noir" aesthetic, it transforms cybersecurity hygiene into an engaging, detective-style experience.

---

## ⚡ Core Functionalities

### 1. 🔍 The Scanner (AI Forensics)
Powered by **Google Gemini 1.5 Flash** and **Playwright**, the Scanner performs real-time forensic analysis on suspicious URLs.
- **Features:** Live screenshot capture, risk scoring (0-100), and heuristic threat detection.
- **Output:** Detailed verdict + categorized findings.

### 2. 📡 The Wiretap (Signal Intercept)
A specialized tool for analyzing unstructured text (SMS, Emails, and Logs).
- **Features:** Instantly extracts embedded malicious links from large blocks of text.
- **Integration:** Seamlessly sends extracted URLs to the Scanner for deep analysis.

### 3. 🎓 Training Dossier
An interactive learning module to sharpen your detective skills.
- **Content:** Identification guides for phishing, vishing, and social engineering.
- **Testing:** "Field Readiness Exam" allows agents to verify their knowledge.

### 4. 📊 Analytics Board
A visual command center for tracking personal and global threat metrics.
- **Metrics:** Threat Velocity, Scam Composition, and Risk Exposure over time.

### 5. 🚨 The Dispatcher
Rapid-response reporting system.
- **Action:** Generates pre-formatted, professional incident reports.
- **Route:** One-click dispatch to authorities (Anti-Phishing Working Group) or Clipboard.

### 6. 🆔 Agent Profile
A complete gamification layer to drive engagement.
- **Progression:** Earn XP for every scan (`+50 XP`), analyze text, or file reports.
- **Ranks:** Climb from *Rookie Informant* to *Director of Intelligence*.
- **Badges:** Unlock achievements like "Elite Interceptor" or "Data Hoarder."

### 7. 🌍 SIGINT Monitor (Raleigh Beta)
A tactical surveillance map visualizing active threats.
- **Current Status:** **Raleigh Beta**. The system is currently hardcoded to track the "Raleigh Node" for ground-truth testing.
- **Visuals:** Live activity pulses, "Dormant" status for global hubs, and a real-time intercept ticker.

---

## 🦠 Threat Categorization Protocol

ScamSherlock classifies threats into **6 Distinct Categories** for clearer intel:

| Category | Indicator | Color Code |
| :--- | :--- | :--- |
| **PHISHING** | Login pages, credential harvesting, bank impersonation. | 🔴 Siren Red |
| **SMISHING** | SMS-based lures, "package delivery" scams. | 🔴 Siren Red |
| **VISHING** | Voice/Call-to-Action, "helpline", "toll-free" keywords. | 🔴 Siren Red |
| **TECH SUPPORT**| "Virus detected", "Microsoft Support", remote access tools. | 🔴 Siren Red |
| **INVESTMENT** | Crypto schemes, "guaranteed returns", Bitcoin wallets. | 🔴 Siren Red |
| **OTHER** | General malicious activity or unclassified malware. | 🟠 Amber |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/scam-sherlock.git
cd scam-sherlock
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```

### 3. Backend Setup
Navigate to the backend directory:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
```
*(Optional)* Create a `.env` in the root for frontend configs:
```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

### 5. Launch
Run the backend server:
```bash
uvicorn main:app --reload --port 8000
```
Open your browser to `http://localhost:5173`.

---

## 🕵️‍♂️ How to Use (Workflow)

1. **Intercept**: Receive a suspicious link (SMS/Email).
2. **Scan**: Paste it into **The Scanner**.
3. **Analyze**: Watch the AI analyze the DOM and screenshot.
4. **Learn**: Review the **Threat Score** and **Category Badge**.
5. **Report**: Use **The Dispatcher** to file a formal complaint.
6. **Track**: Check **SIGINT** and your **Agent Profile** to see your impact.

---

## 🛣️ Roadmap

- [ ] **Case Files**: Persistent storage for ongoing investigations.
- [ ] **Global Scaling**: Expand SIGINT to ingest real-time data from global API feeds.
- [ ] **Mobile App**: Native React Native port for field agents.
- [ ] **Collaborative Mode**: Multi-agent "Task Forces."

---

> *Built for Hackathon 2026. Trust No One. Verify Everything.*
