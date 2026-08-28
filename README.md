<div align="center">

# 🛡️ SentinelShield AI
### Neural Defenders AI — Real-Time Cyber Threat Defense Platform

**AICTE Smart India Hackathon 2026 · Problem Statement SIH26104**

[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![SIH](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)](https://www.sih.gov.in)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

> **Shield Yourself from Online Impersonation** — An enterprise-grade, sub-second (&lt;300ms) multi-modal cybersecurity defense platform engineered to detect synthetic voice cloning, high-entropy phishing URLs, and digital arrest extortion schemes with Section 65B legal admissibility.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features-6-core-shields)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [API Reference](#-api-reference)
- [Voice DSP Pipeline](#-voice-dsp-pipeline)
- [Configuration](#️-configuration)
- [Deployment](#-deployment)
- [Testing](#-testing--training)
- [Team](#-team-neural-defenders)

---

## 🔍 Overview

SentinelShield AI is a **real-time, multi-modal threat defense platform** built for the Smart India Hackathon 2026 (SIH26104). It combats three of India's most rapidly growing cyber threats:

| Threat | Scale in India |
|--------|---------------|
| 🎤 AI Voice Deepfakes | Used in KYC fraud, executive impersonation, family scams |
| 🔗 Phishing URLs | 60+ Indian banks & government portals targeted daily |
| 📱 Digital Arrest SMS Scams | ₹10,000+ Cr lost annually; CBI/ED impersonation surge |

**Key achievements:**
- ⚡ **&lt;300ms** end-to-end voice deepfake detection latency
- 🎯 **97.29% accuracy** (Random Forest on 38 acoustic features, 960 multi-lingual samples)
- 🔒 **Zero disk I/O** for all audio/message processing (TEE RAM page-locking)
- 📄 **Section 65B** compliant forensic PDF generation for legal admissibility
- 🌐 **13 Indian languages** covered in voice model training data

---

## 🚀 Key Features (6 Core Shields)

### 1. 🎤 Voice Integrity Shield
- **Sub-second (&lt;300ms)** acoustic forensic pipeline
- Feature extraction: **128-Mel Filterbanks**, **13 MFCCs**, **8–16kHz STFT Phase Variance**, **Pitch Micro-Jitter**
- Trained on **960 multi-lingual audio files** across **13 Indian languages**
- **97.29% empirical accuracy** · **0.998 ROC-AUC** (Random Forest, 38 features)
- **VAD Gate** — prevents false alarms on background noise
- Real-time WebSocket streaming (200ms PCM chunks) + REST file upload

### 2. 🔗 Link & Phishing Shield
- **Shannon Domain Entropy** (>3.5 bits/char = DGA detection)
- **Levenshtein distance** typosquatting matrix (60+ Indian banking & government brands: SBI, HDFC, ICICI, RBI, UIDAI…)
- **URL shortener unmasking** (30+ known shorteners)
- **Suspicious TLD fingerprinting** (.tk, .ml, .xyz, .top…)
- **IP-in-URL**, excessive subdomains, encoded XSS pattern detection

### 3. 📱 Digital Arrest & SMS Shield
- **Aho-Corasick multi-pattern automaton** — O(n+m) single-pass search
- **82 extortion/threat patterns** across 6 categories:
  - Digital Arrest (CBI, Customs, Police impersonation)
  - Financial Extortion (Safe account, Gift cards, Crypto demands)
  - Urgency Pressure (2-hour deadlines, Secrecy demands)
  - Authority Impersonation (RBI, ED, TRAI, Income Tax)
  - Personal Threats (Family harm, Physical threats)
  - SIM/Account Block threats

### 4. 🔒 Zero-Disk TEE Privacy
- **In-memory RAM page-locking** via `VirtualLock` (Windows) / `mlock` (POSIX)
- **Immediate cryptographic memory zeroization** via `ctypes.memset` on exit
- **Volatile BytesIO buffers** — zero disk I/O for audio/messages
- **HMAC-SHA256 attestation tokens** proving zero-disk retention

### 5. 📄 Section 65B Forensic PDF Dossier
- **In-memory ReportLab PDF** — never touches disk, streamed directly via HTTP
- Combines: Voice telemetry, URL scan analytics, SMS pattern matches
- **SHA-256 telemetry chains** for tamper-evident evidence
- **Legal compliance**: Section 65B Indian Evidence Act 1872 & IT Act 2000

### 6. 🎨 Modular Glassmorphism UI
- **Zero-build Vanilla HTML5, CSS3, ES6** — no bundler, no build step
- **3 Themes**: Dark Glass (default) · Light Crystal Glass · Neon Glass
- **60 FPS Canvas visualizer** (42-band EQ + oscilloscope)
- **PWA/WebAPK ready** (manifest.json, Service Worker)
- **Responsive**: Desktop → tablet → mobile (320px+)

---

## 🛠️ Tech Stack

### Backend
| Component | Version | Purpose |
|-----------|---------|---------|
| Python | 3.11 | Runtime |
| FastAPI | 0.111.0 | REST + WebSocket API |
| Uvicorn | 0.29.0 | ASGI server |
| NumPy | 1.26.4 | Array processing |
| SciPy | 1.13.0 | DSP signal processing |
| Librosa | 0.10.2 | Audio feature extraction |
| Scikit-Learn | 1.5.0 | Random Forest ML model |
| ReportLab | 4.2.0 | In-memory PDF generation |
| PyAhoCorasick | 2.1.0 | Pattern matching automaton |
| SlowAPI | 0.1.9 | Rate limiting |
| Cryptography | 42.0.8 | HMAC, TEE attestation |
| Pydantic v2 | 2.7.1 | Schema validation |
| HTTPX | 0.27.0 | Async n8n webhook dispatch |
| SoundFile | 0.12.1 | Audio decode |

### Frontend
- **Pure HTML5 / CSS3 / ES6** — No build step, no bundler, no npm
- **Web Audio API** — Real-time microphone capture & DSP
- **WebSocket API** — Backend streaming connection
- **Canvas 2D API** — 60 FPS spectrogram visualizer
- **Service Worker** — Offline caching & PWA installability

### Infrastructure
- **Docker** (python:3.11-slim)
- **Render / Railway / Fly.io / GCP Cloud Run** compatible
- **GitHub Actions** — CI/CD for Pages & Android APK build

---

## 📁 Project Structure

```
Neural-Defenders-AI/
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml        # GitHub Pages auto-deploy
│       └── build-apk.yml           # Android APK via PWABuilder
│
├── backend/
│   ├── main.py                     # FastAPI app, routes, WebSocket, static mount
│   ├── requirements.txt            # 42 pinned dependencies
│   ├── models/
│   │   └── voice_classifier.joblib # Trained RF model (38 features, 97.29% acc)
│   ├── core/
│   │   ├── config.py               # Pydantic Settings (.env driven)
│   │   ├── security.py             # Security headers, exception handling, upload validation
│   │   └── tee_guard.py            # TEE: page-locking, zeroization, attestation tokens
│   ├── schemas/
│   │   ├── audio.py                # VoiceAnalysisResponse, VoiceSessionSummary
│   │   ├── url.py                  # URLScanRequest/Response, ThreatIndicator
│   │   └── message.py              # MessageScanRequest/Response, ThreatPattern
│   ├── services/
│   │   ├── voice_dsp.py            # Core DSP engine — decode, MFCC, phase, jitter, ML
│   │   ├── link_shield/
│   │   │   ├── entropy_scanner.py  # Shannon entropy, DGA, TLD, shortener detection
│   │   │   └── typosquatting.py    # Levenshtein + homoglyph brand impersonation
│   │   ├── sms_shield.py           # Aho-Corasick SMS/extortion scanner
│   │   ├── forensic_pdf.py         # ReportLab Section 65B PDF generator
│   │   └── n8n_dispatcher.py       # Async HMAC-signed webhook dispatch
│   └── scripts/
│       ├── train_dataset_model.py  # Train Random Forest on 960 samples
│       ├── evaluate_full_dataset.py
│       └── calibrate_dsp.py
│
├── frontend/
│   ├── index.html                  # Home / Dashboard
│   ├── voice-shield.html           # Voice deepfake detection module
│   ├── link-shield.html            # Phishing URL scanner module
│   ├── sms-shield.html             # SMS extortion detector module
│   ├── 404.html                    # Custom 404 page
│   ├── manifest.json               # PWA manifest (WebAPK ready)
│   ├── sw.js                       # Service Worker (offline caching)
│   ├── pwabuilder-sw.js            # PWABuilder Service Worker
│   ├── css/
│   │   └── style.css               # Glassmorphism design system (951 lines)
│   └── js/
│       ├── app.js                  # Master coordinator, theme, shared state
│       ├── voice-shield.js         # WebAudio + WebSocket + Canvas visualizer
│       ├── link-shield.js          # Client-side entropy fallback
│       ├── sms-shield.js           # Client-side Aho-Corasick fallback
│       └── forensic-pdf.js         # PDF download coordinator
│
├── tests/
│   ├── test_dataset_audio.py
│   ├── test_api_endpoints.py
│   └── test_all_services.py
│
├── .env.example                    # Environment template (copy to .env)
├── .gitignore
├── Dockerfile                      # Production container (python:3.11-slim)
├── Procfile                        # Heroku/Render start command
├── render.yaml                     # Render.com deployment config
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- pip
- Modern browser (Chrome/Firefox/Edge recommended for WebAudio)

### 1. Clone the Repository
```bash
git clone https://github.com/prajwalsharma08/Neural-defenders-ai.git
cd Neural-defenders-ai
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env — fill in APP_SECRET_KEY and TEE_ATTESTATION_PEPPER with random hex values
# Generate secrets: python -c "import secrets; print(secrets.token_hex(32))"
```

### 3. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 4. (Optional) Train the Voice Model
> Skip this step if `backend/models/voice_classifier.joblib` already exists.
```bash
python backend/scripts/train_dataset_model.py
```

### 5. Start the Server
```bash
python backend/main.py
# Server runs at http://localhost:8888
```

### 6. Open the App
Open your browser at 👉 **`http://localhost:8888`**

---

## 🐳 Docker

```bash
# Build the image
docker build -t sentinelshield-ai .

# Run the container
docker run -p 8888:8888 --env-file .env sentinelshield-ai
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/health` | System liveness probe |
| `POST` | `/api/v1/scan-url` | Phishing URL scan |
| `POST` | `/api/v1/scan-message` | SMS/message extortion scan |
| `POST` | `/api/v1/analyze-audio` | Audio file upload analysis (REST) |
| `POST` | `/api/v1/forensic-report` | Generate Section 65B PDF dossier |
| `WS` | `/ws/voice-stream` | Real-time 200ms PCM streaming |

### Health Check
```bash
curl http://localhost:8888/api/v1/health
```
```json
{
  "status": "operational",
  "service": "SentinelShield AI",
  "version": "1.0.0",
  "sih_ref": "SIH26104_AICTE",
  "tee_guard": "active"
}
```

### Scan a URL
```bash
curl -X POST http://localhost:8888/api/v1/scan-url \
  -H "Content-Type: application/json" \
  -d '{"url": "http://sbi-secure-login.tk/verify"}'
```

### Scan an SMS Message
```bash
curl -X POST http://localhost:8888/api/v1/scan-message \
  -H "Content-Type: application/json" \
  -d '{"message": "Your account is blocked. Call CBI officer immediately or face arrest."}'
```

### WebSocket Voice Stream Protocol
**Client → Server (control):**
```json
{ "action": "start", "session_id": "optional-uuid", "sample_rate": 16000 }
{ "action": "ping" }
{ "action": "end_session" }
```
**Client → Server (audio):** Binary `ArrayBuffer` — 200ms PCM int16 @ 16kHz

**Server → Client (result):**
```json
{
  "session_id": "abc123",
  "chunk_index": 5,
  "risk_score": 0.82,
  "verdict": "AI_DETECTED",
  "snr_db": 24.5,
  "phase_variance": 0.91,
  "pitch_jitter": 0.038,
  "attestation_hash": "sha256=...",
  "processing_ms": 14.2,
  "red_alert": true,
  "speech_seconds": 3.4
}
```

---

## 🧠 Voice DSP Pipeline

```
Raw Audio Input (WAV / MP3 / OGG / FLAC / Raw PCM)
        │
        ▼
┌─────────────────────────────────┐
│   Universal Audio Decoder       │  scipy.io.wavfile / soundfile / librosa
│   Resample → 16kHz mono int16   │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   VAD Gate  (RMS < 0.012)       │  → SILENCE verdict, skip processing
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   38-Feature Extraction         │
│  • 13 MFCCs (mean + std = 26)   │
│  • Spectral Centroid  ×2        │
│  • Spectral Bandwidth ×2        │
│  • Spectral Rolloff 85% ×2      │
│  • Zero Crossing Rate ×2        │
│  • RMS Energy         ×2        │
│  • Pitch (Flatness)   ×2        │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Forensic Metrics              │
│  • Phase Variance (8–16kHz)     │  Vocoder ringing detection
│  • Pitch Micro-Jitter           │  AI neural vocoder signature
│  • Centroid Stability           │  Synthetic uniformity detection
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────┐
│   Risk Score Fusion             │
│  R = 0.80 × ML + 0.20 × DSP    │
└──────────────┬──────────────────┘
               │
               ▼
        Verdict Classification
   ┌────────────────────────────┐
   │ SILENCE   │ VAD gate       │
   │ LISTENING │ Speech < 2.0s  │
   │ HUMAN     │ R < 0.35       │
   │ SUSPECTED │ 0.35 ≤ R < 0.60│
   │ DETECTED  │ R ≥ 0.60  🚨  │
   └────────────────────────────┘
```

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Application
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8888
APP_SECRET_KEY=<generate: python -c "import secrets; print(secrets.token_hex(32))">
APP_LOG_LEVEL=INFO

# CORS Origins
CORS_ORIGINS=["http://localhost:8888","http://127.0.0.1:8888"]

# Rate Limits (req/min)
RATE_LIMIT_PUBLIC=30
RATE_LIMIT_WS_PER_CONNECTION=600

# DSP Engine
DSP_SAMPLE_RATE=16000
DSP_RED_ALERT_THRESHOLD=0.85

# n8n Incident Response (optional)
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.example.com/webhook
N8N_WEBHOOK_SECRET=<your-webhook-secret>

# TEE Guard
TEE_ATTESTATION_PEPPER=<generate: python -c "import secrets; print(secrets.token_hex(16))">
```

---

## 🚀 Deployment

### Render / Railway / Fly.io
- Uses `Dockerfile` or `Procfile` automatically
- Set environment variables from `.env.example` in the dashboard
- `PORT` env var is automatically mapped

### GitHub Pages (Frontend Only)
- `.github/workflows/deploy-pages.yml` auto-deploys `frontend/` to Pages
- Frontend works with **client-side fallbacks** when backend is offline
- Full functionality requires the backend server running separately

### PWA / Android WebAPK
- `manifest.json` configured for `display: standalone`
- Install via Chrome: **⋮ menu → Install App**
- Generate Android APK via `build-apk.yml` GitHub Action

---

## 🧪 Testing & Training

```bash
# Run all tests
python -m pytest tests/ -v

# Individual test suites
python -m pytest tests/test_api_endpoints.py   # FastAPI endpoint tests
python -m pytest tests/test_all_services.py    # Service integration tests
python -m pytest tests/test_dataset_audio.py   # Voice model dataset eval

# Train the voice model (requires features.csv dataset)
python backend/scripts/train_dataset_model.py

# Calibrate DSP thresholds
python backend/scripts/calibrate_dsp.py

# Full dataset evaluation
python backend/scripts/evaluate_full_dataset.py
```

---

## 🔐 Security Architecture

| Layer | Mechanism |
|-------|-----------|
| Transport | HTTPS (production), WSS WebSocket |
| Headers | OWASP hardened: `X-Frame-Options: DENY`, `CSP`, `X-XSS-Protection` |
| Rate Limiting | SlowAPI per-IP: 30 req/min public, 600 req/min WebSocket |
| Upload Validation | MIME allowlist, 10MB max, MZ/ELF header rejection |
| Memory Privacy | TEE `VirtualLock`/`mlock` + `ctypes.memset` zeroization |
| Attestation | `HMAC-SHA256(pepper ‖ timestamp ‖ SHA256(payload))` |
| n8n Webhooks | `X-Sentinel-Signature: sha256=...` request signing |

---

## 🎯 Hackathon Alignment (SIH26104)

| SIH Requirement | SentinelShield Implementation |
|-----------------|-------------------------------|
| Sub-second voice deepfake detection | &lt;300ms via WebSocket + DSP pipeline |
| Phishing URL detection | Shannon entropy + typosquatting + TLD fingerprinting |
| Digital arrest / SMS extortion | Aho-Corasick automaton, 82 patterns |
| Legal admissibility (Section 65B) | In-memory PDF with SHA-256 telemetry chains |
| Privacy / Zero-disk | TEE page-locking + memset zeroization |
| Multi-lingual (13 Indian languages) | Training data covers 13 languages |
| Real-time streaming | WebSocket 200ms PCM chunks |
| SOC integration | n8n webhooks (banking freeze, MFA, security alert) |

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `voice_classifier.joblib` not found | Run `python backend/scripts/train_dataset_model.py` |
| Microphone permission denied | Browser → Site Settings → Allow Microphone |
| WebSocket connection fails | Ensure backend is running on port 8888; check firewall |
| PDF generation fails | Backend must be running; check `/api/v1/forensic-report` |
| `pyahocorasick` import error | Pure Python fallback auto-activates transparently |
| GitHub Pages (static hosting) | Frontend works with client-side fallbacks; backend features need a server |
| `streamlit` version conflict warning | Safe to ignore — Streamlit is unrelated to this project |

---

## 👥 Team Neural Defenders

| Member | Role |
|--------|------|
| **Prajwal Sharma** *(Team Leader)* | System Architect & Backend/ML Lead |
| **Ritesh Mishra** | Primary Pitcher & Presentation Lead |
| **Piyoosh Patel** | Frontend Lead (UI/UX Developer) |
| **Shakti Maurya** | Cyber Security & Threat Intelligence Lead |
| **Shivansh Mishra** | Integration & Full-Stack Specialist |
| **Rachit Jaiswal** | DSA & Optimization Engineer |

---

## 📄 License & Attribution

- **SIH26104** — AICTE Smart India Hackathon 2026
- **LinkGuard-main** algorithms ported (entropy scanner, typosquatting)
- **ReportLab** for in-memory PDF generation
- **pyahocorasick** for Aho-Corasick C-extension (with pure Python fallback)
- All code original unless noted in source files

---

<div align="center">

Made with ❤️ by **Team Neural Defenders** for **Smart India Hackathon 2026**

*Protecting India's digital citizens — one detection at a time.*

</div>
