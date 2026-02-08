# Knapsack

**The AI-Powered Autonomous Sales Intelligence Platform**

---

## 👥 Team Knapsack

| Name | Role |
|------|------|
| **Tanish Garg** | Full Stack & AI Engineer |
| **Om Kar Shukla** | Backend & DevOps Lead |
| **Sanchit Garg** | Frontend & UI/UX Architect |
| **Chinmay Soni** | Mobile App Developer |
| **Aditya Mathur** | Data Scientist & AI Researcher |

---

## 🚀 Product Vision

In the high-stakes world of enterprise sales, timing is everything. Traditional lead generation is passive, slow, and often inaccurate. Sales teams waste hours sifting through noise to find a single signal.

**Knapsack** changes the game. It is an **autonomous "Lead Hunter"** that never sleeps. By leveraging agentic AI workflows, semantic search, and real-time web intelligence, Knapsack proactively identifies high-value opportunities, analyzes them for intent, and delivers actionable "Intelligence Dossiers" directly to the sales officer's mobile device—often before the news even hits the mainstream.

> **"Don't just find leads. Hunt opportunities."**

---

## 💎 Key Features

### 🧠 Autonomous Web Intelligence (WIL)
-   **Polyglot Ingestion**: Seamlessly ingests and processes HTML, PDFs (Tenders/Whitepapers), and RSS Feeds.
-   **Semantic Search**: Uses vector embeddings to understand the *meaning* behind content, finding relevant leads that keyword searches miss.
-   **Dual-Engine Analysis**: Combines **Gemini 2.0** for intent classification with a specialized **HPCL (High Priority Content Layer)** for detecting critical business signals like funding rounds or expansion plans.

### 📱 Field-Ready Mobile Intelligence
-   **Real-Time Feed**: A dynamic, TikTok-style feed of high-intent leads customized for each sales officer.
-   **Smart Dossiers**: Instant access to "Why This Lead?" summaries, competitor analysis, and recommended product pitches.
-   **One-Tap Action**: Integrated calling, emailing, and calendar scheduling to strike while the iron is hot.

### � Command Center Dashboard
-   **Pipeline Visibility**: Kanban-style tracking of every lead from discovery to close.
-   **Performance Analytics**: Deep insights into lead sources, conversion rates, and team performance.
-   **Granular Control**: Admin tools to manage team assignments and configure intelligence parameters.

---

## 🏗️ System Architecture

Knapsack is built on a modern, microservices-inspired architecture designed for scale and resilience.

### 1. The Brain: Web Intelligence Layer (`intelligence/`)
The core engine that powers the platform.
-   **Technology**: Node.js, TypeScript, Puppeteer, BullMQ, Qdrant (Vector DB).
-   **The Pipeline**:
    1.  **Ingestion**: Smart crawling with rate limiting and `robots.txt` compliance.
    2.  **Normalization**: Boilerplate removal and deduplication (SHA-256).
    3.  **Embedding**: Vectorizing content for semantic understanding.
    4.  **Analysis**: Intent classification and Entity Extraction using LLMs.
    5.  **Scoring**: Multi-factor scoring algorithm (Trust, Freshness, Signal Density).

### 2. The Spine: Backend API (`backend/`)
The central nervous system orchestrating data and communications.
-   **Technology**: Node.js, Express, PostgreSQL, MongoDB.
-   **Responsibilities**: Authentication (JWT), Data Persistence, API Gateway, and Notification Services (Email/WhatsApp).

### 3. The Face: Web Dashboard (`frontend/`)
The strategic interface for managers.
-   **Technology**: Next.js, React, Tailwind CSS.
-   **Features**: Interactive charts, drag-and-drop pipelines, and responsive design.

### 4. The Hand: Mobile App (`mobile-app/`)
The tactical tool for the field.
-   **Technology**: React Native, Expo.
-   **Features**: Offline-first architecture, push notifications, and native device integration.

---

## ⚙️ The Intelligence Pipeline: Under the Hood

How does a URL become a Lead?

1.  **Crawl**: The `Crawler Worker` fetches the page, handling JS rendering if needed.
2.  **Clean**: The `Normalizer` strips ads and extracts metadata.
3.  **Understand**: The `Embedder` converts text to vectors.
4.  **Analyze**: The `Intent Engine` determines if the content is "Signal" or "Noise".
5.  **Score**: The `Scoring Engine` calculates a holistic score (0-100).
    -   $$ Score = (Confidence \times 0.3) + (Trust \times 0.2) + (Freshness \times 0.15) + (Signal \times 0.15) + (Similarity \times 0.2) $$
6.  **Deliver**: If the score exceeds the threshold, a **Dossier** is generated and pushed to the Sales Officer.

---

## 🛠️ Deployment & Setup

### Prerequisites
-   **Node.js** (v20+)
-   **Docker** (optional, for DBs)
-   **PostgreSQL** & **MongoDB**
-   **Redis** (for Queues)

### Quick Start

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/knapsack-team/knapsack.git
    ```

2.  **Install Dependencies**:
    ```bash
    npm run install:all  # (If configured)
    # OR manually in each folder:
    cd backend && npm install
    cd intelligence && npm install
    cd frontend && npm install
    cd mobile-app && npm install
    ```

3.  **Run Services**:
    ```bash
    # Run in separate terminals
    npm run dev --prefix backend
    npm run dev --prefix intelligence
    npm run dev --prefix frontend
    npx expo start --prefix mobile-app
    ```

---

*© 2026 Team Knapsack. All Rights Reserved.*
