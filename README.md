# 🕵️‍♂️ ScamSherlock: Urban Noir Threat Intelligence
**A localized, high-fidelity security suite for the modern citizen detective.**

[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/Frontend-React-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-green.svg)](https://supabase.com/)
[![Tailwind](https://img.shields.io/badge/Styling-TailwindCSS-06b6d4.svg)](https://tailwindcss.com/)

---

## 🌃 The Mission
Generic scam blockers are failing because they lack context. **ScamSherlock** is an Urban Noir-themed security dashboard that empowers users to intercept, analyze, and report digital threats. Built with a focus on **Ground Truth**, ScamSherlock transforms raw, suspicious data into actionable intelligence.

---

## 🛠️ The Seven Pillars of Investigation

1. **The Scanner**: Real-time URL threat analysis with granular categorization and risk scoring.
2. **The Wiretap**: A high-performance regex engine that extracts hidden URLs from messy text logs and emails.
3. **The Training Dossier**: An interactive field guide teaching "Hover & Intercept" tactics and official domain verification.
4. **The Detective’s Board (Analytics)**: Statistical breakdown of threat composition and personal scan velocity.
5. **The Dispatcher**: Automated incident report generator for filing cases directly with the FTC and APWG.
6. **The Agent Profile**: A persistent XP and Badge system (localStorage) that rewards users for successful field work.
7. **The Threat Ledger**: A persistent "Paper Trail" tracking your last 10 scans with detailed timestamps and verdicts.

---

## 🧠 Tactical Categorization
ScamSherlock identifies the *Modus Operandi* of every threat. Our engine classifies intercepts into six distinct tactical profiles:
* **Phishing** (Email) | **Smishing** (SMS) | **Vishing** (Voice)
* **Tech Support** (Fake Alerts) | **Investment** (Crypto Fraud) | **Other**

---

## 🕵️‍♂️ The Detective's Rank (Gamification)
Security is a habit. Our **Agent Profile** system scales difficulty as you progress, with data persisted via local storage:
* **Rookie Informant**: Your first successful interception.
* **Field Agent**: Over 500 characters of text processed via Wiretap.
* **Senior Detective**: Verified reports dispatched to authorities.
* *Features glowing "Star" badges for completed field achievements.*

---

## 🚀 Technical Architecture
* **Frontend**: React + Vite + TypeScript.
* **Persistence**: Dual-layer storage using **Supabase** (Threat Logs) and **LocalStorage** (Agent XP).
* **Visualization**: Recharts for dynamic time-series velocity and threat composition.
* **UI/UX**: Custom "Noir" Design System (Siren Red & Trenchcoat Amber) built with Tailwind CSS.

---

## 🛠️ Setup & Operations
1. **Clone & Install**: `npm install`
2. **Environment**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env`.
3. **Launch**: `npm run dev`

---

**Developed for the 2026 Hackathon by Rudra Patel & Team.** *Scanning the shadows so you don't have to.*
