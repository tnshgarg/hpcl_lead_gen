# Knapsack

**Empowering Sales Teams with AI-Driven Intelligence**

Knapsack is an advanced lead generation and sales intelligence platform designed to autonomously hunt, analyze, and qualify high-value sales opportunities from the web. By leveraging Generative AI, semantic search, and real-time web scraping, Knapsack transforms raw data into actionable dossiers for sales officers.

## 👥 Team
**Knapsack**

- **Tanish Garg**
- **Om Kar Shukla**
- **Sanchit Garg**
- **Chinmay Soni**
- **Aditya Mathur**

---

## 🏗️ System Architecture

The Knapsack ecosystem consists of four integrated components:

### 1. 🧠 Web Intelligence Layer (WIL) - `intelligence/`
The autonomous "Lead Hunter" engine that powers the platform.
- **Core Function**: Crawls websites, digests PDFs/RSS feeds, and uses AI to generate comprehensive lead dossiers.
- **Key Tech**: Node.js, Puppeteer, Qdrant (Vector DB), Gemini 2.0 (LLM), BullMQ.
- **Features**:
    -   **Polyglot Ingestion**: Handles HTML, PDF, and RSS.
    -   **Semantic Understanding**: Vector embeddings for finding leads by *meaning*, not just keywords.
    -   **HPCL Analyzer**: Specialized High Priority Content Layer for identifying critical business signals (e.g., Tenders, Funding).

### 2. 📱 Sales Officer App - `mobile-app/`
A powerful mobile tool for field sales officers to access intelligence on the go.
- **Core Function**: Delivers real-time lead alerts and deep intelligence dossiers directly to the sales team.
- **Key Tech**: React Native, Expo.
- **Features**:
    -   **Live Feed**: Real-time stream of qualified leads.
    -   **Intelligence Dossiers**: "Why This Lead?" analysis, recommended products, and competitor insights.
    -   **One-Tap Action**: Instant calls, emails, and calendar scheduling.

### 3. 💻 Web Dashboard - `frontend/`
The command center for sales managers and admins.
- **Core Function**: innovative interface for monitoring lead pipelines, analyzing performance, and managing team assignments.
- **Key Tech**: Next.js, React, Tailwind CSS.
- **Features**:
    -   **Data Visualization**: Charts and graphs of lead sources and quality.
    -   **Pipeline Management**: Kanban-style tracking of lead status.

### 4. ⚙️ Backend API - `backend/`
The robust central server orchestrating data flow.
- **Core Function**: Manages authentication, data persistence, and communication between services.
- **Key Tech**: Node.js, Express, PostgreSQL, MongoDB.
- **Features**:
    -   **Unified API**: Serves both mobile and web clients.
    -   **Notification Service**: Handles WhatsApp and Email alerts.

---

## 🚀 Key Features

- **Autonomous Discovery**: The system finds leads while you sleep.
- **AI-Powered Analysis**: It doesn't just scrape; it *reads* and *scores* content based on trust, freshness, and relevance.
- **Smart Dossiers**: Auto-generates executive summaries and "Product-to-Pitch" recommendations.
- **Real-Time Alerts**: Pushes high-value opportunities to sales officers instantly.
- **Seamless Integration**: End-to-end flow from web discovery to closed deal.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v20+)
- PostgreSQL & MongoDB
- Redis (for Queue management)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-org/knapsack.git
    cd knapsack
    ```

2.  **Start the Services**:
    Each service (backend, intelligence, frontend, mobile-app) has its own `package.json`.
    ```bash
    # Terminal 1: Backend
    cd backend && npm install && npm run dev

    # Terminal 2: Intelligence Layer
    cd intelligence && npm install && npm run dev

    # Terminal 3: Web Dashboard
    cd frontend && npm install && npm run dev

    # Terminal 4: Mobile App
    cd mobile-app && npm install && npx expo start
    ```

---

*Built with ❤️ by Team Knapsack*
