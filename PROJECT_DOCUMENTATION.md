# SentinelShield AI — Neural Defenders AI
## Complete Project Documentation for Restarting from Scratch

---

## 📋 PROJECT OVERVIEW

**Project Name:** SentinelShield AI (Neural Defenders AI)  
**Hackathon:** AICTE Smart India Hackathon 2026 (SIH26104)  
**Problem Statement:** SIH26104 — Real-Time Sub-Second Voice Deepfake, Phishing & Digital Arrest Defense Platform  
**Repository:** https://github.com/prajwalsharma08/Neural-defenders-ai.git  
**Team:** Neural Defenders (6 members)

---

## 👥 TEAM ROLES

| Member | Role |
|--------|------|
| Prajwal Sharma (Team Leader) | System Architect & Backend/ML Lead |
| Ritesh Mishra | Primary Pitcher & Presentation Lead |
| Piyoosh Patel | Frontend Lead (UI/UX Developer) |
| Shakti Maurya | Cyber Security & Threat Intelligence Lead |
| Shivansh Mishra | Integration & Full-Stack Specialist |
| Rachit Jaiswal | DSA & Optimization Engineer |

---

## 🚀 KEY FEATURES (6 Core Shields)

### 1. 🎤 Voice Integrity Shield
- **Sub-second (<300ms)** acoustic forensic pipeline
- **128-Mel Filterbanks**, **13-MFCCs**, **8–16kHz STFT Phase Variance**, **Pitch Micro-Jitter** biometrics
- Trained on **960 multi-lingual audio files** across **13 Indian languages**
- **97.29% empirical accuracy** (Random Forest on 38 acoustic features)
- **VAD Gate** (Voice Activity Detection) — prevents false alarms on background noise
- **Multi-second (2–5s) speech accumulator** for stable high-confidence classification
- Real-time WebSocket streaming (200ms PCM chunks) + REST file upload

### 2. 🔗 Link & Phishing Shield
- **Shannon Domain Entropy** calculation (>3.5 bits/char for DGA detection)
- **Levenshtein distance** typosquatting matrix (60+ Indian banking & government brands)
- **URL shortener unmasking** (30+ known shorteners)
- **Suspicious TLD fingerprinting** (free/abused TLDs: .tk, .ml, .xyz, .top, etc.)
- **IP-in-URL detection**, excessive subdomains, encoded XSS patterns
- Ported from LinkGuard-main (JavaScript → Python)

### 3. 📱 Digital Arrest & SMS Shield
- **Aho-Corasick multi-pattern automaton** (O(n+m) single-pass search)
- **82 extortion/threat patterns** across 6 categories:
  - Digital Arrest (CBI, Customs, Police)
  - Financial Extortion (Safe account, Gift cards, Crypto)
  - Urgency Pressure (2-hour deadlines, Secrecy demands)
  - Authority Impersonation (RBI, ED, TRAI, Income Tax)
  - Personal Threats (Family harm, Physical threats)
  - SIM/Account Block threats
- **Pure Python fallback** if `pyahocorasick` C-extension unavailable

### 4. 🔒 Zero-Disk TEE Privacy (Trusted Execution Environment)
- **In-memory RAM page-locking** via `VirtualLock` (Windows) / `mlock` (POSIX)
- **Immediate cryptographic memory zeroization** via `ctypes.memset` on exit
- **Volatile BytesIO buffers** — zero disk I/O for audio/messages
- **HMAC-SHA256 attestation tokens** proving zero-disk retention

### 5. 📄 Section 65B Forensic PDF Dossier
- **In-memory ReportLab PDF generation** (zero disk writes)
- Combines: Voice telemetry, URL scan analytics, SMS pattern matches
- **SHA-256 telemetry chains** for tamper-evident evidence
- **Legal compliance**: Section 65B Indian Evidence Act 1872 & IT Act 2000
- Streamed directly via HTTP response

### 6. 🎨 Modular Glassmorphism UI
- **Zero-build Vanilla HTML5, CSS3, ES6 JavaScript**
- **3 Themes**: Dark Glass (default), Light Crystal Glass, Neon Glass
- **60 FPS Canvas visualizer** (42-band EQ + oscilloscope)
- **PWA/WebAPK ready** (manifest.json, Service Worker)
- **Responsive**: Desktop, tablet, mobile (320px+)

---

## 🛠️ TECH STACK

### Backend
| Component | Version |
|-----------|---------|
| Python | 3.11 |
| FastAPI | 0.111.0 |
| Uvicorn | 0.29.0 |
| WebSockets | 12.0 |
| NumPy | 1.26.4 |
| SciPy | 1.13.0 |
| Librosa | 0.10.2 |
| Scikit-Learn | 1.5.0 |
| Joblib | 1.4.2 |
| ReportLab | 4.2.0 |
| Pydantic v2 | 2.7.1 |
| SlowAPI (Rate Limiting) | 0.1.9 |
| PyAhoCorasick | 2.1.0 |
| Cryptography | 42.0.8 |
| HTTPX | 0.27.0 |
| SoundFile | 0.12.1 |

### Frontend
- **Pure HTML5/CSS3/ES6** (no build step, no bundler)
- **CSS Custom Properties** for theming
- **Web Audio API** for real-time microphone capture
- **WebSocket API** for backend streaming
- **Service Worker** for offline/PWA
- **Canvas 2D** for 60 FPS spectrogram

### Infrastructure
- **Docker** (python:3.11-slim)
- **Render/Railway/Fly.io/GCP Cloud Run** compatible
- **GitHub Actions** for CI/CD (deploy-pages.yml, build-apk.yml)

---

## 📁 PROJECT STRUCTURE

```
Neural-Defenders-AI-main/
├── .github/
│   └── workflows/
│       ├── deploy-pages.yml      # GitHub Pages deployment
│       └── build-apk.yml         # Android APK build via PWABuilder
├── backend/
│   ├── main.py                   # FastAPI entry point (429 lines)
│   ├── requirements.txt          # 42 dependencies
│   ├── models/
│   │   └── voice_classifier.joblib  # Trained Random Forest model (38 features)
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py             # Pydantic Settings (.env driven)
│   │   ├── security.py           # Middleware: Security headers, exception handling, upload validation
│   │   └── tee_guard.py          # TEE: page-locking, zeroization, attestation tokens
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── audio.py              # VoiceAnalysisResponse, VoiceSessionSummary, AudioChunkMeta
│   │   ├── url.py                # URLScanRequest/Response, ThreatIndicator
│   │   └── message.py            # MessageScanRequest/Response, ThreatPattern
│   ├── services/
│   │   ├── __init__.py
│   │   ├── voice_dsp.py          # Core DSP engine (459 lines) — audio decode, MFCC, phase variance, jitter, ML inference
│   │   ├── link_shield/
│   │   │   ├── __init__.py
│   │   │   ├── entropy_scanner.py  # Shannon entropy, DGA, TLD, shortener detection
│   │   │   └── typosquatting.py    # Levenshtein + homoglyph brand impersonation
│   │   ├── sms_shield.py         # Aho-Corasick SMS/Message scanner (298 lines)
│   │   ├── forensic_pdf.py       # ReportLab PDF generator (322 lines)
│   │   └── n8n_dispatcher.py     # Async HMAC-signed webhook dispatch (banking freeze, MFA, alerts)
│   └── scripts/
│       ├── train_dataset_model.py    # Train Random Forest on 960 samples
│       ├── evaluate_full_dataset.py  # Full dataset evaluation
│       ├── calibrate_dsp.py          # Threshold calibration
│       ├── debug_*.py                # Various debug/verification scripts
│       └── test_*.py                 # Test scripts
├── frontend/
│   ├── index.html                # Home/Dashboard (281 lines)
│   ├── voice-shield.html         # Voice module (373 lines)
│   ├── link-shield.html          # Link module (161 lines)
│   ├── sms-shield.html           # SMS module (171 lines)
│   ├── 404.html                  # Custom 404 page
│   ├── manifest.json             # PWA manifest (WebAPK ready)
│   ├── sw.js                     # Service Worker
│   ├── pwabuilder-sw.js          # PWABuilder SW
│   ├── css/
│   │   └── style.css             # 951 lines — Glassmorphism design system
│   ├── js/
│   │   ├── app.js                # Master coordinator (173 lines)
│   │   ├── voice-shield.js       # Voice module (774 lines) — WebAudio, WebSocket, visualizer
│   │   ├── link-shield.js        # Link module (175 lines) — Client-side entropy fallback
│   │   ├── sms-shield.js         # SMS module (191 lines) — Client-side Aho-Corasick fallback
│   │   └── forensic-pdf.js       # PDF download coordinator (112 lines)
│   └── img/                      # Icons, screenshots
├── tests/
│   ├── test_dataset_audio.py
│   ├── test_api_endpoints.py
│   └── test_all_services.py
├── .env.example                  # Environment template (40 lines)
├── .gitignore
├── Dockerfile                    # Production container
├── Procfile                      # Heroku/Render start command
├── render.yaml                   # Render.com deployment config
└── README.md                     # Project overview (54 lines)
```

---

## ⚙️ CONFIGURATION (.env)

```bash
# Application
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8888
APP_SECRET_KEY=<64-char-hex>
APP_LOG_LEVEL=INFO

# CORS
CORS_ORIGINS=["http://localhost:9999","http://localhost:5173","http://localhost:3000","http://127.0.0.1:9999"]

# Rate Limits (requests/minute)
RATE_LIMIT_AUTH_PER_IP=5
RATE_LIMIT_AUTH_PER_ACCOUNT=10
RATE_LIMIT_PUBLIC=30
RATE_LIMIT_WS_PER_CONNECTION=600
RATE_LIMIT_AUTH_BACKOFF_BASE_SECONDS=2

# DSP Engine
DSP_BUFFER_MS=200
DSP_SAMPLE_RATE=16000
DSP_SNR_THRESHOLD_DB=12.0
DSP_RED_ALERT_THRESHOLD=0.85

# n8n Incident Response
N8N_WEBHOOK_BASE_URL=https://your-n8n-instance.example.com/webhook
N8N_WEBHOOK_SECRET=<webhook-secret>
N8N_BANKING_FREEZE_PATH=/banking-freeze
N8N_MFA_CHALLENGE_PATH=/mfa-challenge
N8N_SECURITY_ALERT_PATH=/security-alert

# File Upload
MAX_UPLOAD_BYTES=10485760  # 10 MB

# TEE Guard
TEE_ATTESTATION_PEPPER=<32-char-hex>
```

---

## 🔌 API ENDPOINTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | System liveness probe |
| POST | `/api/v1/scan-url` | Phishing URL scan (entropy, typosquatting, TLD) |
| POST | `/api/v1/scan-message` | SMS/Message extortion pattern scan |
| POST | `/api/v1/analyze-audio` | Audio file upload analysis (REST) |
| POST | `/api/v1/forensic-report` | Generate Section 65B PDF dossier |
| WS | `/ws/voice-stream` | Real-time 200ms PCM streaming |

### WebSocket Protocol (`/ws/voice-stream`)
**Client → Server (Control):**
```json
{ "action": "start", "session_id": "optional", "sample_rate": 16000 }
{ "action": "ping" }
{ "action": "end_session" }
```

**Client → Server (Audio):** Binary `ArrayBuffer` (200ms PCM int16 @ 16kHz)

**Server → Client (Results):**
```json
{
  "session_id": "...",
  "chunk_index": 0,
  "risk_score": 0.0-1.0,
  "snr_db": 24.5,
  "phase_variance": 0.85,
  "pitch_jitter": 0.028,
  "spectral_centroid_stability": 0.65,
  "verdict": "HUMAN|AI_SUSPECTED|AI_DETECTED|LISTENING|SILENCE",
  "attestation_hash": "hmac-sha256-token",
  "processing_ms": 14.2,
  "red_alert": false,
  "is_speaking": true,
  "speech_seconds": 1.2
}
```

---

## 🧠 VOICE DSP PIPELINE (backend/services/voice_dsp.py)

### Audio Decoder (Universal)
- **WAV**: scipy.io.wavfile → resample to 16kHz mono int16
- **MP3/OGG/FLAC**: soundfile/librosa fallback
- **Raw PCM**: Pass through

### Feature Extraction (38 features matching trained model)
1. **13 MFCCs** (mean + std = 26 features)
2. **Spectral Centroid** (mean + std)
3. **Spectral Bandwidth** (mean + std)
4. **Spectral Rolloff 85%** (mean + std)
5. **Zero Crossing Rate** (mean + std)
6. **RMS Energy** (mean + std)
7. **Pitch (Spectral Flatness)** (mean + std)

### Forensic Metrics
- **Phase Variance** (8–16 kHz): STFT phase diff variance → vocoder ringing detection
- **Pitch Jitter**: Autocorrelation F0 micro-variations → AI neural vocoder signature
- **Centroid Stability**: Spectral centroid std over frames → synthetic uniformity detection

### Risk Score Fusion
```
scaled_ml_risk = clip((ml_prob_ai - 0.20) / (0.45 - 0.20), 0, 1)
dsp_score = 0.50 * phase_score + 0.35 * jitter_score + 0.15 * centroid_score
R_final = clip(0.80 * scaled_ml_risk + 0.20 * dsp_score, 0, 1)
```

### Verdict Thresholds
| Verdict | Condition |
|---------|-----------|
| SILENCE | VAD gate (RMS < 0.012) |
| LISTENING | Speech < 2.0s accumulated |
| HUMAN | R_final < 0.35 |
| AI_SUSPECTED | 0.35 ≤ R_final < 0.60 |
| AI_DETECTED | R_final ≥ 0.60 (Red Alert) |

---

## 🔗 LINK SHIELD ALGORITHMS

### Entropy Scanner (`entropy_scanner.py`)
1. **HTTPS Check** — Insecure HTTP penalty
2. **URL Shortener** — 30+ known services
3. **IP-in-URL** — Raw IP or IP in hostname
4. **Suspicious TLD** — 25+ high-abuse TLDs
5. **Excessive Subdomains** — >4 dots in host
6. **Domain Shannon Entropy** — Normalized entropy >0.88 & len>12 → DGA
7. **Phishing Keywords** — 18 sensitive keywords in path/query/domain
8. **Encoded XSS** — `%3cscript`, `data:text/html`, etc.

### Typosquatting Detector (`typosquatting.py`)
- **Brand Registry**: 60+ Indian banks/gov (SBI, HDFC, ICICI, RBI, UIDAI, etc.)
- **Levenshtein Distance**: Max edit ratio 0.40
- **Homoglyph Normalization**: 0→o, 1→l, 3→e, 4→a, 5→s, @→a, rn→m, vv→w, accented chars
- **Embedded Brand Check**: Brand keyword in suspicious context

### Score Fusion
```
phishing_score = 1 - Π(1 - indicator.severity)
```

---

## 📱 SMS SHIELD ALGORITHMS (`sms_shield.py`)

### Aho-Corasick Automaton
- **C-extension** (`pyahocorasick`) preferred, **Pure Python fallback** included
- **82 keywords** across 14 pattern groups
- **O(n+m)** single-pass matching

### Pattern Categories & Weights
| Category | Patterns | Weight Range |
|----------|----------|--------------|
| digital_arrest | 3 | 0.88–0.95 |
| financial_extortion | 2 | 0.85–0.92 |
| urgency_pressure | 2 | 0.75–0.80 |
| authority_impersonation | 2 | 0.82–0.87 |
| personal_threat | 1 | 0.97 |

### Threat Score Fusion
```
threat_score = 1 - Π(1 - pattern.weight)
```

### Verdicts
| Verdict | Condition |
|---------|-----------|
| DIGITAL_ARREST_DETECTED | digital_arrest pattern + score > 0.65 |
| SCAM_DETECTED | score > 0.65 |
| SUSPICIOUS | score > 0.30 |
| SAFE | otherwise |

---

## 🔐 TEE GUARD (`tee_guard.py`)

### Memory Page Locking
```python
# Windows: kernel32.VirtualLock()
# POSIX: libc.mlock()
```

### Zeroization
```python
ctypes.memset(buffer_address, 0, length)
```

### Attestation Token
```
HMAC-SHA256(pepper || timestamp || SHA256(payload))
```
Proves audio was processed in volatile RAM with zero disk persistence.

### Context Manager
```python
with volatile_audio_buffer(raw_pcm) as bio:
    # Process audio
    # On exit: zeroize + unlock guaranteed
```

---

## 🚨 N8N DISPATCHER (`n8n_dispatcher.py`)

### Red Alert Triggers (R_final > 0.85)
1. **Banking Freeze** → `POST /banking-freeze`
2. **MFA Challenge** → `POST /mfa-challenge`
3. **Security Alert** → `POST /security-alert`

### Security
- **HMAC-SHA256** request signing (`X-Sentinel-Signature: sha256=...`)
- **Async httpx** with exponential backoff (3 retries)
- **Concurrent dispatch** via `asyncio.gather`

---

## 📄 FORENSIC PDF (`forensic_pdf.py`)

### Report Sections
1. **Cover/Metadata** — Session ID, timestamp, integrity hash, SIH26104 reference
2. **Voice Forensics** — Verdict, risk scores, attestation chain (last 10 tokens)
3. **URL Analysis** — Domain, entropy, phishing score, indicators table
4. **SMS/Extortion** — Threat score, matched patterns table, recommended action
5. **Legal Footer** — Section 65B compliance statement, integrity checksum

### In-Memory Generation
- `io.BytesIO` buffer only
- Streamed via `StreamingResponse` — never touches disk

---

## 🎨 FRONTEND ARCHITECTURE

### Design System (CSS Custom Properties)
```css
:root {
  --bg-primary: #080914;
  --glass-panel-bg: rgba(15,18,38,0.70);
  --glass-blur: blur(24px);
  --accent-cyan: #38bdf8;
  --accent-emerald: #10b981;
  --accent-crimson: #ef4444;
  --font-sans: 'Inter';
  --font-mono: 'JetBrains Mono';
}
```

### Themes (via `data-theme` attribute)
- **dark** (default): Midnight obsidian + cyber violet
- **light**: Crystal glass (light backgrounds)
- **neon**: Cyber violet neon (dark + purple/pink accents)

### Module Pattern (Vanilla JS)
```javascript
window.VoiceShield = { init(), toggleStreaming(), ... }
window.LinkShield = { init(), scanUrl(), ... }
window.SmsShield = { init(), scanMessage(), ... }
window.ForensicPdf = { init(), downloadPdf(), ... }
window.SentinelApp = { applyTheme(), getApiUrl(), sharedForensicData, ... }
```

### Key UI Components
- **Radial SVG Gauge** (stroke-dashoffset animation)
- **60 FPS Canvas Visualizer** (42-band EQ + sine oscilloscope)
- **Glassmorphism Cards** (backdrop-filter, layered shadows)
- **Verdict Pills** (color-coded: emerald=human, amber=suspected, crimson=AI)
- **HUD Pills** (latency, attestation hash ticker)
- **Modal PDF Export** (in-memory download)

---

## 🐳 DEPLOYMENT

### Local Development
```bash
# Clone
git clone https://github.com/prajwalsharma08/Neural-defenders-ai.git
cd Neural-defenders-ai

# Backend
cp .env.example .env
# Edit .env with your values
pip install -r backend/requirements.txt
python backend/main.py
# Server at http://localhost:8888

# Frontend: Served automatically by FastAPI static files mount at /
```

### Docker
```bash
docker build -t sentinelshield-ai .
docker run -p 8888:8888 --env-file .env sentinelshield-ai
```

### Render.com / Railway / Fly.io
- Uses `Dockerfile` or `Procfile`
- Set environment variables in dashboard
- `PORT` env var automatically mapped

### GitHub Pages (Frontend Only)
- `.github/workflows/deploy-pages.yml` deploys `frontend/` to Pages
- Backend must run separately for full functionality

### PWA / WebAPK
- `manifest.json` configured for `display: standalone`
- Service Worker (`sw.js`) for offline caching
- Android Chrome: "Install App" button appears
- `pwabuilder-sw.js` for PWABuilder APK generation

---

## 🧪 TESTING & TRAINING

### Train Voice Model
```bash
python backend/scripts/train_dataset_model.py
# Reads features.csv (960 samples, 38 features)
# Outputs: backend/models/voice_classifier.joblib
```

### Run Tests
```bash
python -m pytest tests/
# test_dataset_audio.py   — Dataset evaluation
# test_api_endpoints.py   — FastAPI endpoint tests
# test_all_services.py    — Service integration tests
```

### Calibration Scripts
```bash
python backend/scripts/calibrate_dsp.py        # Threshold tuning
python backend/scripts/evaluate_full_dataset.py # Full eval
python backend/scripts/test_upload_api.py       # API upload test
```

---

## 🔑 CRITICAL IMPLEMENTATION DETAILS

### 1. Zero-Disk Guarantee
- All audio/message processing in `io.BytesIO` + `volatile_audio_buffer()`
- `tee_guard.zeroize_buffer()` called in `finally` block
- PDF generated in memory, streamed directly

### 2. Client-Side Fallbacks (Critical for Static Hosting)
- **Voice Shield**: WebAudio DSP runs 100% in browser if backend unavailable
- **Link Shield**: Client-side Shannon entropy + keyword matching
- **SMS Shield**: Client-side pattern matching (simplified Aho-Corasick)
- **Forensic PDF**: Alerts user to connect backend for real ReportLab PDF

### 3. Localhost Detection
```javascript
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';
```
Routes to backend API on localhost, client-side fallback elsewhere.

### 4. Rate Limiting (SlowAPI)
- Per-IP limits from `.env`
- WebSocket: 600 req/min per connection
- Public endpoints: 30 req/min

### 5. Security Headers (Middleware)
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=(self)
Content-Security-Policy: [configured for inline scripts/styles, ws/wss]
```

### 6. Upload Validation
- MIME type allowlist (audio/*, text/*)
- 10 MB max size
- Rejects executables (MZ/ELF headers)

---

## 📦 MODEL ARTIFACTS

### `backend/models/voice_classifier.joblib`
```python
{
  "model": RandomForestClassifier(n_estimators=150, max_depth=14, ...),
  "scaler": StandardScaler(),
  "feature_names": ["mfcc_1_mean", "mfcc_1_std", ..., "pitch_std"],  # 38 features
  "accuracy": 0.9729,
  "roc_auc": 0.998,
  "total_samples": 960
}
```

### Training Data
- **Source**: `C:\Users\FRONTMAN\OneDrive\Desktop\voice-data-main\features.csv`
- **Fallback**: `../dataset/features.csv`
- **960 samples** across **13 Indian languages**
- **Labels**: 'AI' vs 'Human'

---

## 🎯 HACKATHON ALIGNMENT (SIH26104)

| Requirement | Implementation |
|-------------|----------------|
| Sub-second voice deepfake detection | <300ms via WebSocket + DSP |
| Phishing URL detection | Shannon entropy + typosquatting + TLD |
| Digital arrest/SMS extortion | Aho-Corasick 82 patterns |
| Legal admissibility (Section 65B) | In-memory PDF with SHA-256 chains |
| Privacy/Zero-disk | TEE page-locking + memset zeroization |
| Multi-lingual (13 Indian langs) | Training data covers 13 languages |
| Real-time streaming | WebSocket 200ms chunks |
| SOC integration | n8n webhooks (banking freeze, MFA) |

---

## 🚀 QUICK START CHECKLIST

- [ ] Clone repository
- [ ] Copy `.env.example` → `.env` and fill secrets
- [ ] `pip install -r backend/requirements.txt`
- [ ] Ensure `backend/models/voice_classifier.joblib` exists (run training script if not)
- [ ] Run `python backend/main.py`
- [ ] Open `http://localhost:8888`
- [ ] Test Voice Shield (microphone permission required)
- [ ] Test Link Shield (paste suspicious URL)
- [ ] Test SMS Shield (paste extortion message)
- [ ] Generate Forensic PDF (requires backend)

---

## 🔧 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Model not found | Run `python backend/scripts/train_dataset_model.py` |
| Microphone denied | Browser settings → Site permissions → Allow microphone |
| WebSocket fails | Check firewall, ensure backend running on port 8888 |
| PDF generation fails | Backend must be running; check `/api/v1/forensic-report` |
| pyahocorasick import error | Pure Python fallback auto-activates |
| Static hosting (GitHub Pages) | Frontend works with client-side fallbacks; backend features need server |

---

## 📝 NOTES FOR RESTARTING

1. **Start with backend/core/config.py** — Define all settings via Pydantic
2. **Build tee_guard.py first** — Core privacy primitive used by voice_dsp
3. **Implement voice_dsp.py** — Universal decoder → Feature extraction → ML inference
4. **Create schemas** — Pydantic v2 models for request/response validation
5. **Build services** — link_shield (entropy + typosquat), sms_shield (Aho-Corasick)
6. **Add n8n_dispatcher** — Async webhook dispatch with HMAC signing
7. **Create forensic_pdf.py** — ReportLab in-memory generation
8. **Wire main.py** — FastAPI app, middleware, routes, WebSocket, static mount
9. **Frontend: style.css** — CSS custom properties design system first
10. **Frontend: app.js** — Master coordinator, theme, PWA, shared state
11. **Frontend modules** — voice-shield.js (WebAudio + WebSocket), link-shield.js, sms-shield.js
12. **HTML pages** — index.html + 3 module pages, all linking shared CSS/JS
13. **PWA** — manifest.json, sw.js for offline/installability
14. **Docker/Deploy** — Dockerfile, Procfile, render.yaml, GitHub Actions
15. **Train model** — Run training script, verify joblib loads in voice_dsp

---

## 📄 LICENSE & ATTRIBUTION

- **SIH26104** — AICTE Smart India Hackathon 2026
- **LinkGuard-main** algorithms ported (entropy scanner, typosquatting)
- **ReportLab** for PDF generation
- **pyahocorasick** for Aho-Corasick (with pure Python fallback)
- All code original unless noted in source files

---

*Document generated from comprehensive codebase analysis. Use this as the single source of truth for rebuilding SentinelShield AI from scratch.*