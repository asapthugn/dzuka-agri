# Dzuka Agri Backend 🌱🤖

AI-powered multi-agent backend for Dzuka Agri, built with FastAPI and LangGraph.

## Overview

Dzuka Agri is a multi-agent system designed to help farmers make smarter decisions. Specialized agents collaborate to analyze crop conditions and generate recommendations.

Current agents:

* 🌾 Agronomy Agent
* 🌦️ Climate Agent
* 🐛 Pest Agent
* ✅ Review Agent
* 🧠 Master Orchestrator

---

## Architecture

```text
Client
  ↓
POST /recommendation
  ↓
FastAPI
  ↓
LangGraph
  ↓
Master Orchestrator
  ↓
Agronomy Agent
  ↓
Climate Agent
  ↓
Pest Agent
  ↓
Review Agent
  ↓
Final Recommendation
```

---

## Project Structure

```text
backend/
├── agents/
├── api/
├── config/
├── data/
├── graph/
├── models/
├── prompts/
├── services/
├── tools/
├── main.py
├── requirements.txt
└── .env
```

---

## Features

### Implemented

* FastAPI backend
* LangGraph workflow
* Multi-agent architecture
* Master orchestrator
* Agronomy agent
* Climate agent
* Pest agent
* Review agent
* REST API endpoint
* Swagger documentation

### In Progress

* GPT-powered agents
* Tool calling
* Weather integration
* Market intelligence
* Parallel agent execution
* OpenAI Agents SDK
* Band integration
* Vision-based disease analysis

---

## Installation

Clone repository:

```bash
git clone <repository-url>
cd backend
```

Create virtual environment:

```bash
python -m venv .venv
```

Activate environment:

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Running the API

Start FastAPI server:

```bash
uvicorn main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

## API Endpoint

### POST /recommendation

Request:

```json
{
  "crop": "maize",
  "symptoms": "yellow leaves",
  "latitude": -6.9,
  "longitude": 107.6
}
```

Response:

```json
{
  "recommendation": "Final agricultural recommendation..."
}
```

---

## Tech Stack

* Python
* FastAPI
* LangGraph
* Pydantic

Planned:

* OpenAI Agents SDK
* GPT models
* Weather APIs
* Band AI

---

## Roadmap

### Phase 1

* [x] FastAPI
* [x] LangGraph
* [x] Multi-agent workflow
* [x] Recommendation endpoint

### Phase 2

* [ ] Tool layer
* [ ] Mock data
* [ ] Prompt engineering

### Phase 3

* [ ] GPT-powered agents

### Phase 4

* [ ] Parallel execution

### Phase 5

* [ ] OpenAI Agents SDK

### Phase 6

* [ ] Band integration

### Phase 7

* [ ] Vision-based disease detection

---

Built for the Band of Agents Hackathon 2026 🚀🌍🐧
