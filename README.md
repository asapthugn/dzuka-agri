# Dzuka Agri

**"Dzuka"** means *Rise* in Chichewa — an AI-powered agricultural intelligence platform built to help smallholder farmers in Malawi rise through better, real-time farming decisions.

Built for the **Band of Agents Hackathon 2026**, Dzuka Agri uses a collaborative multi-agent system where specialized AI agents work sequentially — each enriching the context for the next — to deliver holistic farming recommendations from a single query.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Multi-Agent Pipeline](#multi-agent-pipeline)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Roadmap](#roadmap)

---

## Overview

Farmers provide their **crop type**, **GPS coordinates**, and **observed symptoms** (e.g., yellowing leaves, wilting). Dzuka Agri's six-agent pipeline then:

1. Fetches live weather data for the exact GPS location
2. Reverse-geocodes coordinates to a readable region name
3. Runs each AI agent — agronomist, climate analyst, pest specialist, market analyst
4. Synthesizes all outputs into a single prioritized action plan

The result: a farmer gets soil guidance, irrigation schedules, pest treatment plans, market prices, and a final recommendation — all in one response.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND  (Next.js 15)                    │
│   Landing → Analysis Page → Map → Streaming Agent Results   │
│                  + Follow-up Chat Interface                  │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP / Server-Sent Events (SSE)
┌───────────────────────▼─────────────────────────────────────┐
│                   BACKEND  (FastAPI)                         │
│   POST /api/recommendation   |   POST /api/geo/lookup        │
│              │                                               │
│              └──► LangGraph Multi-Agent Pipeline            │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
  ┌─────▼──────┐  ┌─────▼──────┐  ┌────▼──────┐
  │ Nominatim  │  │ Open-Meteo │  │ Groq API  │
  │ Geocoding  │  │ Weather    │  │ (LLaMA)   │
  └────────────┘  └────────────┘  └───────────┘
```

### Data Flow

1. User enters crop, GPS coordinates, and symptoms in the frontend
2. Frontend streams results via `POST /api/recommendation/stream`
3. Backend initializes LangGraph state and runs the 6-agent pipeline
4. Each agent enriches the shared state and returns structured output
5. The Review Agent synthesizes everything into a final prioritized plan
6. Frontend renders each agent's result as it arrives, then the final recommendation
7. User can ask follow-up questions in the integrated chat interface

---

## Multi-Agent Pipeline

```
START
  │
  ▼
[1] Master Orchestrator  →  initializes state, validates inputs
  │
  ▼
[2] Agronomy Agent       →  soil assessment, fertilizer plan, irrigation advice
  │
  ▼
[3] Climate Agent        →  live weather, climate risks, planting windows
  │
  ▼
[4] Pest Agent           →  disease/pest diagnosis, treatment (organic + chemical), prevention
  │
  ▼
[5] Market Agent         →  current crop prices, demand forecast, selling strategy
  │
  ▼
[6] Review Agent         →  synthesizes all outputs → situation summary + priority actions
  │
  ▼
END
```

### Agents

| Agent | Responsibility | LLM |
|---|---|---|
| **Master Orchestrator** | State initialization, context setup | — |
| **Agronomy Agent** | Soil health, fertilization, irrigation scheduling | Groq LLaMA 3.3 70B |
| **Climate Agent** | Live weather via Open-Meteo, climate risk scoring | Groq LLaMA 3.3 70B |
| **Pest & Disease Agent** | Symptom diagnosis, cause identification, treatment plan | Groq LLaMA 3.3 70B |
| **Market Agent** | Crop prices, market outlook, profitability analysis | Groq LLaMA 3.3 70B |
| **Review Agent** | Cross-domain synthesis, priority action list, final advice | Groq LLaMA 3.3 70B |

---

## Tech Stack

### Backend

| Technology | Role |
|---|---|
| **Python 3.x** | Runtime |
| **FastAPI** | REST API framework |
| **LangGraph** | Multi-agent orchestration (StateGraph) |
| **LangChain** | LLM abstraction and prompt chaining |
| **Groq SDK** | LLaMA 3.3 70B (text) + LLaMA-4 Scout (vision) |
| **Open-Meteo** | Free real-time weather API (no key required) |
| **Nominatim / geopy** | Free reverse geocoding (no key required) |
| **Pydantic** | Request/response validation |
| **Uvicorn** | ASGI server |

### Frontend

| Technology | Role |
|---|---|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **Leaflet + react-leaflet** | Interactive GPS map |
| **react-markdown** | Markdown rendering for agent outputs |
| **lucide-react** | Icon library |

---

## Project Structure

```
dzuka-agri/
├── backend/
│   ├── agents/
│   │   ├── master_orchestrator.py   # Pipeline entry point
│   │   ├── agronomy_agent.py        # Soil, fertilizer, irrigation
│   │   ├── climate_agent.py         # Weather and climate risk
│   │   ├── pest_agent.py            # Disease diagnosis and treatment
│   │   ├── market_agent.py          # Prices and selling strategy
│   │   └── review_agent.py          # Final synthesis
│   ├── api/
│   │   ├── routes.py                # /recommendation endpoints
│   │   └── geo_routes.py            # /geo/lookup endpoint
│   ├── config/
│   │   └── settings.py              # Environment config
│   ├── data/
│   │   ├── weather.json             # Mock weather profiles
│   │   ├── soil.json                # Mock soil profiles
│   │   └── market.json              # Mock market price data
│   ├── graph/
│   │   ├── state.py                 # DzukaState TypedDict
│   │   └── workflow.py              # Compiled LangGraph StateGraph
│   ├── models/
│   │   ├── request_model.py         # RecommendationRequest schema
│   │   ├── response_model.py        # RecommendationResponse schema
│   │   └── schemas.py               # Geospatial models
│   ├── prompts/
│   │   ├── agronomy_prompt.py
│   │   ├── climate_prompt.py
│   │   ├── pest_prompt.py
│   │   ├── market_prompt.py
│   │   └── review_prompt.py
│   ├── services/
│   │   ├── openai_service.py        # Groq client initialization
│   │   └── csv_service.py           # Data loading utilities
│   ├── tools/
│   │   ├── geocoding_tool.py        # Nominatim reverse geocoding
│   │   ├── weather_tool.py          # Open-Meteo live weather
│   │   └── vision_tool.py           # Image crop disease analysis
│   ├── main.py                      # FastAPI app entry point
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── app/
    │   ├── page.tsx                 # Landing page
    │   ├── analyze/page.tsx         # Main analysis interface
    │   ├── about/page.tsx           # About page
    │   ├── layout.tsx               # Root layout
    │   └── api/
    │       ├── recommendation/stream/route.ts   # SSE stream proxy
    │       └── chat/stream/route.ts             # Chat SSE proxy
    ├── components/
    │   ├── Navbar.tsx               # Navigation bar
    │   ├── FarmMap.tsx              # Leaflet GPS map
    │   └── FarmChat.tsx             # Follow-up chat interface
    ├── package.json
    └── next.config.ts               # Proxies /api/* to localhost:8000
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A free [Groq API key](https://console.groq.com)

### 1. Clone the Repository

```bash
git clone <repo-url>
cd dzuka-agri
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Start the server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`
API docs available at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

The Next.js config automatically proxies `/api/*` requests to the backend.

---

## API Reference

### `POST /api/recommendation`

Run the full multi-agent pipeline and return results synchronously.

**Request Body**

```json
{
  "crop": "maize",
  "symptoms": "yellowing leaves on lower stalks, stunted growth",
  "latitude": -13.9626,
  "longitude": 33.7741,
  "session_id": "optional-session-id",
  "farmer_id": "optional-farmer-id"
}
```

**Response**

```json
{
  "recommendation": "Final synthesized advice from Review Agent...",
  "agronomy_output": "Soil assessment and fertilizer plan...",
  "climate_output": "Current weather conditions and climate risks...",
  "pest_output": "Diagnosis: Nitrogen deficiency / Fall Armyworm...",
  "market_output": "Maize price: MWK 280/kg, market outlook..."
}
```

---

### `POST /api/recommendation/stream`

Same as above but streams each agent's output as Server-Sent Events (SSE).

**Event sequence:**
1. `region` — resolved location name
2. `agronomy` — agronomy agent output
3. `climate` — climate agent output
4. `pest` — pest agent output
5. `market` — market agent output
6. `review_chunk` — final review streamed token-by-token
7. `done` — stream end signal

---

### `POST /api/geo/lookup`

Resolve GPS coordinates to location metadata.

**Request Body**

```json
{
  "latitude": -13.9626,
  "longitude": 33.7741,
  "crop": "maize"
}
```

**Response**

```json
{
  "location_name": "Lilongwe, Malawi",
  "weather": { ... },
  "soil_profile": null,
  "market_data": { ... }
}
```

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
# Required
GROQ_API_KEY=your_groq_api_key_here

# Optional (Open-Meteo and Nominatim are free and require no keys)
OPENAI_API_KEY=your_openai_key_if_needed
OPENWEATHER_API_KEY=your_openweather_key_if_needed
```

---

## Roadmap

- [x] FastAPI backend with CORS
- [x] LangGraph multi-agent pipeline (6 agents)
- [x] Streaming SSE responses per agent
- [x] Live weather integration (Open-Meteo)
- [x] Reverse geocoding (Nominatim)
- [x] Groq LLaMA 3.3 70B integration
- [x] Interactive Leaflet map for GPS selection
- [x] Follow-up chat interface
- [ ] Vision-based disease detection from image uploads
- [ ] Parallel agent execution for speed
- [ ] Farmer session persistence (database)
- [ ] SMS/USSD interface for feature phones
- [ ] Multilingual support (Chichewa)
- [ ] Band AI integration
- [ ] Mobile-responsive PWA

---

## Contributing

This project was built for the Band of Agents Hackathon 2026. Contributions, issues, and feature requests are welcome.

---

## License

MIT
