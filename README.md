# AutoCFO — Autonomous Financial Intelligence for SMBs

AutoCFO is an AI-powered financial intelligence platform built for small and medium businesses (SMBs). It continuously monitors financial data, detects risks, predicts cash flow, and triggers actions in real time.

The system functions as a virtual Chief Financial Officer, converting raw financial data into actionable insights for businesses operating without dedicated finance teams.

---

## The Challenge

The SMB sector in India, comprising over 63 million enterprises, faces critical inefficiencies in financial management:

- **Delayed Financial Visibility**: Financial insights are not available in real time, slowing decision-making.
- **Poor Liquidity Management**: Cash flow risks are identified too late, leading to operational disruptions.
- **Manual Compliance Overhead**: GST tracking and reconciliation are error-prone and time-consuming.
- **Non Data-Driven Decisions**: Lack of predictive insights results in inefficient capital allocation.
- **Passive Financial Systems**: Traditional tools act as systems of record, not systems of action.

---

## The Architecture

AutoCFO transforms financial management from a retrospective accounting function into a proactive intelligence system through a pipeline of ingestion, analysis, and automated execution.

### Core Technical Pillars

- **Unified Data Ingestion**: Aggregates data from bank statements, UPI transactions, and GST sources into a centralized transaction layer.
- **Anomaly and Risk Detection**: Applies AI models to identify cash flow risks, overdue payments, unusual spending patterns, and compliance issues.
- **Predictive Analytics**: Uses time-series forecasting to estimate future cash flow and calculate operational runway.
- **Event-Driven Workflows**: Automatically triggers actions when predefined financial thresholds or compliance deadlines are reached.
- **Omnichannel Intelligence Delivery**: Sends real-time alerts and summaries via WhatsApp for immediate stakeholder awareness.

---

## Technology Stack

### Frontend
- Framework: React.js with Vite
- State Management: React Hooks (useState, useEffect)
- Icons: Lucide React
- Styling: Utility-first CSS

### Backend
- Framework: FastAPI (Python)
- Database: Supabase (PostgreSQL)
- AI/LLM: Google Gemini and Groq (LLaMA 3)

### Infrastructure
- AI-ML Service: Dedicated service for risk detection and forecasting
- Workflow Automation: n8n for event-driven execution
- Notifications: WhatsApp Cloud API (Meta)
- API Communication: RESTful APIs with Axios

---

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AutoCFO
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

# Add environment variables in .env
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Add VITE_API_URL in .env
npm run dev
```

### 4. AI-ML Service
```bash
cd ai-ml
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt

uvicorn main:app --reload --port 8001
```

---

## Environment Variables

Create `.env` files in `backend` and `ai-ml` services:

```env
GEMINI_API_KEY=
GROQ_API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
```

---

## Key Features

- **Real-time financial monitoring**
- **AI-driven risk detection**
- **Cash flow forecasting and runway estimation**
- **GST deadline tracking and compliance alerts**
- **Automated workflows via n8n**
- **WhatsApp-based real-time notifications**
- **Explainable AI insights for each detected risk**

---

## Use Case (Demo Scenario)

AutoCFO is tested using a simulated SMB dataset:
1. **Detects** an upcoming cash shortage
2. **Flags** overdue invoices
3. **Identifies** GST deadlines

The system automatically generates insights, recommends actions, and notifies the business owner without manual intervention.

---

## Future Enhancements
- AI-driven financial recommendations and optimization
- Multi-business and team support
- Payment integrations for automated execution
- Advanced anomaly and fraud detection
- Mobile application

---

## License
This project is developed for hackathon and educational purposes.