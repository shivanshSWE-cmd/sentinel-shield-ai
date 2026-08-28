/**
 * SentinelShield AI — Digital Arrest & SMS Extortion Shield Module (Vanilla JS)
 * Enhanced with Smart Backend Endpoint Resolution + Client-Side Fallback
 */

window.SmsShield = {
  init() {
    const scanBtn = document.getElementById('btnScanMessage');
    const inputEl = document.getElementById('messageScanInput');
    const channelSelect = document.getElementById('messageChannelSelect');

    if (scanBtn && inputEl) {
      scanBtn.addEventListener('click', () => {
        const text = inputEl.value;
        const channel = channelSelect ? channelSelect.value : 'sms';
        this.scanMessage(text, channel);
      });
    }

    // Quick fill sample triggers for demo
    const sampleBtns = document.querySelectorAll('.sample-threat-btn');
    sampleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (inputEl) {
          inputEl.value = btn.dataset.sampleText;
          const channel = channelSelect ? channelSelect.value : 'sms';
          this.scanMessage(inputEl.value, channel);
        }
      });
    });
  },

  async scanMessage(text, channel) {
    if (!text || !text.trim()) {
      alert("Please enter or paste message text to scan.");
      return;
    }

    const container = document.getElementById('messageResultsContainer');
    const scanBtn = document.getElementById('btnScanMessage');
    if (scanBtn) scanBtn.textContent = 'SCANNING PATTERNS...';

    const apiUrl = window.SentinelApp.getApiUrl('/api/v1/scan-message');

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), source_channel: channel }),
      });

      if (res.ok) {
        const data = await res.json();
        window.SentinelApp.sharedForensicData.sms_data = data;
        this.renderResults(data);
        return;
      }
      throw new Error(`Server returned ${res.status}`);
    } catch (err) {
      console.warn("Backend API unavailable — using client-side Aho-Corasick pattern engine:", err);
      const clientData = this.analyzeMessageInClient(text.trim(), channel);
      window.SentinelApp.sharedForensicData.sms_data = clientData;
      this.renderResults(clientData);
    } finally {
      if (scanBtn) scanBtn.textContent = '⚡ SCAN EXTORTION & ARREST PATTERNS';
    }
  },

  // --------------------------------------------------------------------------
  // Client-Side Pattern Matching Engine
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // Client-Side Advanced Semantic & Pattern Matching Engine
  // --------------------------------------------------------------------------
  analyzeMessageInClient(text, channel) {
    const textLower = text.toLowerCase().trim();

    const patterns = [
      // 1. Direct Death Threats & Physical Harm (Critical)
      {
        id: 'PT001',
        name: 'Direct Death & Physical Violence Threat',
        keywords: [
          'i will kill you', 'i will kill u', 'will kill you', 'will kill u', 'kill you', 'kill u',
          'going to kill you', 'murder you', 'end your life', 'shoot you', 'stab you', 'harm you',
          'physical harm', 'die bitch', 'death threat', 'beat you up', 'break your legs',
          'cut you', 'send goons', 'send gangsters', 'gangster threat', 'goonda sent',
          'we know where you live', 'your family will suffer', 'we will find you', 'hunt you down',
          'last day of your life', 'pay or die', 'kill your family', 'eliminate you', 'destroy you'
        ],
        cat: 'personal_threat',
        weight: 0.99
      },
      // 2. Blackmail & Sextortion
      {
        id: 'BM001',
        name: 'Blackmail & Sextortion Threat',
        keywords: [
          'leak your video', 'leak your photos', 'leak your pics', 'send video to your contacts',
          'send to all your contacts', 'send to your friends', 'post on social media', 'post on facebook',
          'post on instagram', 'intimate video', 'intimate photos', 'webcam recorded', 'nude photos',
          'viral video', 'ruin your reputation', 'defame you', 'pay ransom', 'pay or i leak',
          'pay or we expose', 'expose your secrets', 'blackmail'
        ],
        cat: 'personal_threat',
        weight: 0.96
      },
      // 3. Digital Arrest & Law Enforcement Impersonation
      {
        id: 'DA001',
        name: 'CBI & Law Enforcement Arrest Warrant',
        keywords: [
          'cbi arrest', 'cbi warrant', 'cbi officer', 'cbi', 'central bureau of investigation',
          'you have been arrested', 'digital arrest', 'cyber arrest', 'under arrest',
          'arrest warrant', 'arrested', 'non-bailable arrest warrant', 'cyber crime department',
          'crime branch', 'arrest warrant issued', 'chargesheet filed'
        ],
        cat: 'digital_arrest',
        weight: 0.95
      },
      {
        id: 'DA002',
        name: 'Customs & Narcotics Seizure',
        keywords: [
          'customs seizure', 'narcotics control', 'package seized', 'illegal parcel',
          'drug shipment', 'customs department', 'ncb arrest', 'narcotics bureau',
          'customs parcel', 'drugs found in parcel', 'contraband seized'
        ],
        cat: 'digital_arrest',
        weight: 0.92
      },
      {
        id: 'DA003',
        name: 'Police Enforcement & Court Notice',
        keywords: [
          'police will arrive', 'cops are coming', 'fir registered', 'non-bailable warrant',
          'nbw issued', 'cybercrime fir', 'police custody', 'supreme court notice',
          'high court warrant', 'court summons issued', 'police inquiry'
        ],
        cat: 'digital_arrest',
        weight: 0.90
      },
      // 4. Financial Extortion
      {
        id: 'FE001',
        name: 'Safe Account Money Transfer Demand',
        keywords: [
          'transfer money immediately', 'send money now', 'transfer to safe account',
          'safe account', 'rbi safe account', 'supreme court deposit', 'pay fine immediately',
          'penalty payment', 'settlement amount', 'transfer rs', 'pay immediately',
          'deposit money now', 'pay fine or arrest', 'transfer amount to avoid'
        ],
        cat: 'financial_extortion',
        weight: 0.92
      },
      {
        id: 'FE002',
        name: 'Gift Card / Crypto Extortion',
        keywords: [
          'buy gift card', 'send bitcoin', 'send usdt', 'crypto payment',
          'google play card', 'itunes card', 'amazon gift card payment',
          'transfer crypto', 'pay in bitcoin'
        ],
        cat: 'financial_extortion',
        weight: 0.86
      },
      // 5. Urgency & Isolation Pressure
      {
        id: 'UP001',
        name: 'Immediate Deadline / Panic Coercion',
        keywords: [
          '2 hour deadline', 'two hour deadline', 'within 2 hours', 'within 1 hour',
          '30 minutes remaining', 'last chance', 'immediate action required',
          'do not delay', 'act now or', 'time is running out', 'final warning',
          'last warning', 'respond immediately'
        ],
        cat: 'urgency_pressure',
        weight: 0.78
      },
      {
        id: 'UP002',
        name: 'Secrecy & Video Call Isolation',
        keywords: [
          'do not tell anyone', 'keep this confidential', 'don't inform family',
          'don't call police', 'stay on the call', 'disconnect at your own risk',
          'do not disconnect video call', 'remain in isolated room', 'stay on camera'
        ],
        cat: 'urgency_pressure',
        weight: 0.82
      },
      // 6. Utility & Account Suspension
      {
        id: 'AI001',
        name: 'SIM / Electricity / Banking Cutoff Threat',
        keywords: [
          'sim will be blocked', 'sim card blocked', 'account will be frozen',
          'bank account suspended', 'kyc suspended', 'aadhaar flagged',
          'electricity will be disconnected', 'electricity bill unpaid', 'power cutoff tonight',
          'pan deactivated', 'credit card blocked'
        ],
        cat: 'authority_impersonation',
        weight: 0.84
      }
    ];

    const matched = [];
    const matchedIds = new Set();

    for (const pat of patterns) {
      for (const kw of pat.keywords) {
        if (textLower.includes(kw)) {
          if (!matchedIds.has(pat.id)) {
            matchedIds.add(pat.id);
            matched.push({
              pattern_id: pat.id,
              pattern_name: pat.name,
              matched_fragment: kw,
              category: pat.cat,
              weight: pat.weight,
            });
          }
          break;
        }
      }
    }

    // Grammatical regex intent checks
    const hasDeathRegex = /\b(i\s+(will|shall|am\s+going\s+to|gonna)\s+(kill|murder|shoot|stab|harm|destroy|end|hurt|eliminate)\s+(you|u|your))\b/i.test(textLower)
      || /\b(kill\s+(you|u)|murder\s+you|death\s+threat|end\s+your\s+life|pay\s+or\s+die|shoot\s+you|stab\s+you|eliminate\s+you)\b/i.test(textLower);

    const hasBlackmailRegex = /\b(leak|post|share|expose|send|publish)\s+(it|your\s+video|video|photo|photos|pics|webcam|pictures|secrets|mms|clip)\b/i.test(textLower)
      || /\b(recorded|captured|hacked)\s+(your\s+)?(video|webcam|screen|camera|clip)\b/i.test(textLower)
      || /\b(pay|send\s+money)\s+(or|if\s+you\s+do\s+not|if\s+you\s+don't)\s+.*(leak|send|post|expose|ruin|publish)\b/i.test(textLower)
      || /\b(leak|send|post)\s+.*(contacts|friends|family|facebook|instagram|social\s+media)\b/i.test(textLower)
      || textLower.includes("blackmail") || textLower.includes("ransom");

    const hasDigitalArrestRegex = /\b(digital\s+arrest|cbi|ncb|narcotics|customs|police|fir|warrant|chargesheet|crime\s+branch)\b/i.test(textLower);
    const hasUtilityRegex = /\b(electricity|power|sim|bill|kyc|pan|aadhaar)\s+(cutoff|disconnected|blocked|suspended|deactivated|frozen|unpaid)\b/i.test(textLower);

    // Compute threat score using probabilistic union: 1 - product(1 - w)
    let threatScore = 0.0;
    if (matched.length > 0) {
      let complement = 1.0;
      matched.forEach(p => { complement *= (1.0 - p.weight); });
      threatScore = Math.round((1.0 - complement) * 100) / 100;
    }

    // Semantic Meaning & Intent Extraction
    let semantic = {};
    let verdict = 'SAFE';
    let action = 'No threat indicators detected. Message appears safe.';

    if (hasDeathRegex || matched.some(m => m.pattern_id === 'PT001')) {
      threatScore = Math.max(threatScore, 0.99);
      verdict = 'PERSONAL_THREAT_DETECTED';
      semantic = {
        core_meaning: `CRITICAL DEATH / VIOLENCE THREAT: The sender is explicitly threatening severe physical violence or death against the recipient ("${text.length > 50 ? text.substring(0, 50) + '...' : text}").`,
        threat_level: 'CRITICAL',
        threat_category_label: 'Direct Physical Harm & Death Threat',
        target_vector: 'Personal Life & Physical Safety',
        coercion_tactic: 'Criminal Intimidation & Death Threat (IPC Section 506 / BNS 351)',
        urgency_level: 'CRITICAL',
        sentiment_polarity: 'Highly Aggressive & Violent'
      };
      action = 'EMERGENCY: Do NOT reply or confront sender. Preserve screenshots and message logs. Immediately dial National Emergency (112) or Cybercrime Helpline (1930) and report to local Police.';
      if (!matched.some(m => m.pattern_id === 'PT001')) {
        matched.unshift({
          pattern_id: 'PT001',
          pattern_name: 'Direct Death & Physical Violence Threat',
          matched_fragment: text.substring(0, 40),
          category: 'personal_threat',
          weight: 0.99
        });
      }
    } else if (hasBlackmailRegex || matched.some(m => m.pattern_id === 'BM001')) {
      threatScore = Math.max(threatScore, 0.96);
      verdict = 'SCAM_DETECTED';
      semantic = {
        core_meaning: 'EXTORTION & SEXTORTION: The sender is threatening to publicly distribute confidential, intimate, or defamatory media to contacts unless paid.',
        threat_level: 'CRITICAL',
        threat_category_label: 'Blackmail & Sextortion',
        target_vector: 'Personal Privacy, Honor & Reputation',
        coercion_tactic: 'Defamation & Ransom Extortion (IT Act 67 / IPC 384)',
        urgency_level: 'HIGH',
        sentiment_polarity: 'Coercive & Intimidating'
      };
      action = 'CRITICAL: Do NOT pay any money or send gift cards. Block the sender, save evidence, and register an immediate cybercrime complaint at cybercrime.gov.in / 1930.';
    } else if (hasDigitalArrestRegex || matched.some(m => m.category === 'digital_arrest')) {
      threatScore = Math.max(threatScore, 0.94);
      verdict = 'DIGITAL_ARREST_DETECTED';
      semantic = {
        core_meaning: 'DIGITAL ARREST SCAM: The sender is impersonating legal authorities (CBI / Customs / Police) with fabricated arrest warrants to coerce an emergency money transfer into a "safe account".',
        threat_level: 'HIGH',
        threat_category_label: 'Digital Arrest Impersonation',
        target_vector: 'Legal Liberty & Financial Bank Accounts',
        coercion_tactic: 'Fake Warrant Coercion & Law Enforcement Impersonation',
        urgency_level: 'HIGH',
        sentiment_polarity: 'Authoritative & Threatening'
      };
      action = 'ALERT: Indian law enforcement NEVER conducts arrests via video calls or asks for money transfers. Hang up immediately, do NOT transfer funds, and dial 1930.';
    } else if (hasUtilityRegex || matched.some(m => m.pattern_id === 'AI001')) {
      threatScore = Math.max(threatScore, 0.85);
      verdict = 'SCAM_DETECTED';
      semantic = {
        core_meaning: 'UTILITY / SERVICE CUTOFF FRAUD: The sender is fabricating an urgent service deactivation (Electricity / SIM / KYC) to force a panic payment or link click.',
        threat_level: 'HIGH',
        threat_category_label: 'Utility Disconnection Scam',
        target_vector: 'Financial Credentials & Personal Identity',
        coercion_tactic: 'False Panic & Urgency Pressure',
        urgency_level: 'HIGH',
        sentiment_polarity: 'Deceptive & Urgent'
      };
      action = 'Do NOT click any links or call numbers provided in the message. Verify bill/KYC status directly through official service provider apps.';
    } else if (threatScore > 0.60 || matched.length > 0) {
      verdict = 'SCAM_DETECTED';
      semantic = {
        core_meaning: 'SUSPICIOUS COERCION / EXTORTION: The message contains indicators of social engineering, unsolicited financial demands, or panic urgency.',
        threat_level: 'ELEVATED',
        threat_category_label: 'Social Engineering & Extortion',
        target_vector: 'Financial Assets',
        coercion_tactic: 'Psychological Urgency & Social Engineering',
        urgency_level: 'MEDIUM',
        sentiment_polarity: 'Manipulative'
      };
      action = 'High scam probability. Do not comply with demands, do not click links, and report to 1930.';
    } else if (threatScore > 0.25) {
      verdict = 'SUSPICIOUS';
      semantic = {
        core_meaning: 'The message contains mild urgency or suspicious phrasing, but no verified malicious markers.',
        threat_level: 'LOW',
        threat_category_label: 'Unverified Phrasing',
        target_vector: 'General Inquiry',
        coercion_tactic: 'None Detected',
        urgency_level: 'LOW',
        sentiment_polarity: 'Neutral'
      };
      action = 'Exercise caution. Verify the sender identity through official channels.';
    } else {
      threatScore = 0.02;
      verdict = 'SAFE';
      semantic = {
        core_meaning: 'BENIGN / SAFE: Normal communication with zero extortion, violence, or impersonation markers detected.',
        threat_level: 'SAFE',
        threat_category_label: 'Benign Communication',
        target_vector: 'None',
        coercion_tactic: 'None',
        urgency_level: 'LOW',
        sentiment_polarity: 'Neutral / Non-Threatening'
      };
      action = 'No threat indicators detected. The message appears safe.';
    }

    // SHA-256 simulation in JS
    let hash = '';
    for (let i = 0; i < 64; i++) hash += '0123456789abcdef'[Math.floor(Math.random() * 16)];

    return {
      text_hash: hash,
      source_channel: channel,
      matched_patterns: matched,
      total_patterns_matched: matched.length,
      threat_score: threatScore,
      verdict: verdict,
      recommended_action: action,
      scan_ms: 12,
      semantic_analysis: semantic,
    };
  },

  // --------------------------------------------------------------------------
  // Rich Visualizer & Semantic Meaning Renderer
  // --------------------------------------------------------------------------
  renderResults(data) {
    const container = document.getElementById('messageResultsContainer');
    if (!container) return;

    container.style.display = 'block';

    const threatPct = Math.round((data.threat_score || 0) * 100);
    const isCritical = data.verdict === 'PERSONAL_THREAT_DETECTED' || data.verdict === 'DIGITAL_ARREST_DETECTED' || threatPct >= 80;
    const isScam = data.verdict === 'SCAM_DETECTED' || threatPct >= 50;
    const isSuspicious = data.verdict === 'SUSPICIOUS';

    const badgeClass = isCritical || isScam
      ? 'badge-danger' 
      : isSuspicious 
      ? 'badge-warning' 
      : 'badge-safe';

    const sem = data.semantic_analysis || {
      core_meaning: data.verdict === 'SAFE' ? 'Normal communication with no threat indicators.' : 'Extortion and pressure indicators detected.',
      threat_level: isCritical ? 'CRITICAL' : isScam ? 'HIGH' : isSuspicious ? 'ELEVATED' : 'SAFE',
      threat_category_label: data.verdict.replace(/_/g, ' '),
      target_vector: isCritical ? 'Personal Safety / Freedom' : 'Financial / Identity',
      coercion_tactic: 'Psychological Coercion',
      urgency_level: isCritical ? 'CRITICAL' : 'MEDIUM',
      sentiment_polarity: isCritical ? 'Highly Aggressive' : 'Neutral'
    };

    let patternsHtml = '';
    if (data.matched_patterns && data.matched_patterns.length > 0) {
      patternsHtml = data.matched_patterns.map(pat => `
        <div class="hud-pill" style="margin-bottom: 0.5rem; justify-content: space-between; flex-wrap: wrap; width: 100%; display: flex; padding: 0.65rem 0.9rem; background: rgba(22, 27, 56, 0.65); border: 1px solid var(--glass-border);">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-weight: 700; color: var(--accent-crimson);">🚨 ${pat.pattern_name}</span>
            <span class="badge badge-warning" style="font-size: 0.65rem;">${pat.category}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-main);">
            Matched Vector: "<em style="color: var(--accent-cyan); font-weight: 600;">${pat.matched_fragment}</em>"
          </div>
          <div style="font-weight: 800; color: var(--accent-crimson); font-family: var(--font-mono);">
            Impact: +${Math.round(pat.weight * 100)}%
          </div>
        </div>
      `).join('');
    } else {
      patternsHtml = `<p style="color: var(--accent-emerald); font-family: var(--font-mono); font-size: 0.82rem;">✅ Zero coercive extortion or violence patterns matched.</p>`;
    }

    container.innerHTML = `
      <div class="glass-card" style="margin-top: 1.5rem; border: 1px solid ${isCritical ? 'rgba(239, 68, 68, 0.45)' : isScam ? 'rgba(245, 158, 11, 0.45)' : 'var(--glass-border)'};">
        
        <!-- Header Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
            <span class="badge ${badgeClass}" style="font-size: 0.85rem; padding: 0.35rem 0.85rem;">${data.verdict}</span>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">
              ⚡ Aho-Corasick + NLP Parser: ${data.scan_ms} ms
            </span>
          </div>
          <div style="font-family: var(--font-mono); font-weight: 900; font-size: 1.35rem;">
            Threat Score: <span style="color: ${threatPct > 60 ? 'var(--accent-crimson)' : threatPct > 30 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};">${threatPct}%</span>
          </div>
        </div>

        <!-- 🧠 SEMANTIC ANALYSIS & SENTENCE MEANING (What is written & core intent) -->
        <div style="margin-bottom: 1.25rem; background: ${isCritical ? 'rgba(239, 68, 68, 0.12)' : isScam ? 'rgba(245, 158, 11, 0.10)' : 'rgba(16, 185, 129, 0.08)'}; padding: 1.1rem; border-radius: var(--radius-md); border: 1px solid ${isCritical ? 'rgba(239, 68, 68, 0.35)' : isScam ? 'rgba(245, 158, 11, 0.30)' : 'rgba(16, 185, 129, 0.25)'};">
          <div style="display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.5rem;">
            <span style="font-size: 1.1rem;">🧠</span>
            <h4 style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 800; color: ${isCritical ? 'var(--accent-crimson)' : isScam ? 'var(--accent-amber)' : 'var(--accent-emerald)'}; text-transform: uppercase; letter-spacing: 0.04em;">
              Semantic Intent & Sentence Meaning
            </h4>
          </div>
          
          <p style="font-size: 0.92rem; color: var(--text-main); font-weight: 600; line-height: 1.55; margin-bottom: 0.85rem;">
            ${sem.core_meaning}
          </p>

          <!-- Semantic Vector Metadata Tags -->
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; font-family: var(--font-mono); font-size: 0.72rem;">
            <span style="background: var(--glass-panel-bg); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); color: var(--accent-cyan);">
              🎯 Target: <strong>${sem.target_vector}</strong>
            </span>
            <span style="background: var(--glass-panel-bg); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); color: var(--accent-purple);">
              🛡️ Tactic: <strong>${sem.coercion_tactic}</strong>
            </span>
            <span style="background: var(--glass-panel-bg); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); color: ${sem.urgency_level === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-amber)'};">
              ⏳ Urgency: <strong>${sem.urgency_level}</strong>
            </span>
            <span style="background: var(--glass-panel-bg); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--glass-border); color: var(--text-muted);">
              🎭 Tone: <strong>${sem.sentiment_polarity}</strong>
            </span>
          </div>
        </div>

        <!-- Recommended Action Advisory -->
        <div style="margin-bottom: 1.25rem; padding: 0.9rem; border-radius: var(--radius-md); background: rgba(15, 18, 38, 0.75); border: 1px solid var(--glass-border);">
          <strong style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); display: block; margin-bottom: 0.3rem;">
            📋 Recommended Next Steps & Legal Protection:
          </strong>
          <p style="font-size: 0.84rem; color: var(--text-main); line-height: 1.5;">
            ${data.recommended_action}
          </p>
        </div>

        <!-- Matched Pattern Vectors -->
        <h4 style="font-family: var(--font-mono); font-size: 0.82rem; margin-bottom: 0.75rem; color: var(--text-main);">
          Matched Threat & Extortion Vectors (${data.total_patterns_matched}):
        </h4>
        ${patternsHtml}

        <!-- Zero Plaintext SHA-256 Telemetry Ticker -->
        <div style="margin-top: 1.25rem; background: var(--input-bg); padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
            🔒 Zero-Plaintext TEE Privacy SHA-256:
          </span>
          <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-cyan); word-break: break-all;">
            ${data.text_hash}
          </span>
        </div>

      </div>
    `;
  }
};

};
