"""
SentinelShield AI — Digital Arrest & SMS Extortion Shield.

Uses Aho-Corasick multi-pattern matching for sub-millisecond detection of
digital arrest, customs seizure, financial extortion, and urgency pressure
indicators in any language (Latin-script transliterations included).
"""
from __future__ import annotations

import hashlib
import logging
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

try:
    import ahocorasick
except ImportError:
    ahocorasick = None

from backend.schemas.message import MessageScanRequest, MessageScanResponse, ThreatPattern

logger = logging.getLogger("sentinelshield.sms_shield")


# ---------------------------------------------------------------------------
# Threat Pattern Definitions
# ---------------------------------------------------------------------------
@dataclass
class PatternDef:
    pattern_id: str
    pattern_name: str
    keywords: List[str]
    category: str
    weight: float


import re

# ---------------------------------------------------------------------------
# Threat Pattern Definitions (Extensive Multi-Category Suite)
# ---------------------------------------------------------------------------
@dataclass
class PatternDef:
    pattern_id: str
    pattern_name: str
    keywords: List[str]
    category: str
    weight: float


PATTERN_DEFINITIONS: List[PatternDef] = [
    # --- Direct Violence & Death Threats (Critical Priority) ---
    PatternDef(
        pattern_id="PT001", pattern_name="Direct Death & Physical Violence Threat",
        keywords=[
            "i will kill you", "i will kill u", "will kill you", "will kill u", "kill you", "kill u",
            "going to kill you", "murder you", "end your life", "shoot you", "stab you", "harm you",
            "physical harm", "die bitch", "death threat", "beat you up", "break your legs",
            "cut you", "send goons", "send gangsters", "gangster threat", "goonda sent",
            "we know where you live", "your family will suffer", "we will find you", "hunt you down",
            "last day of your life", "pay or die", "kill your family", "eliminate you", "destroy you",
        ],
        category="personal_threat", weight=0.99,
    ),
    # --- Blackmail & Sextortion ---
    PatternDef(
        pattern_id="BM001", pattern_name="Blackmail & Sextortion Threat",
        keywords=[
            "leak your video", "leak your photos", "leak your pics", "send video to your contacts",
            "send to all your contacts", "send to your friends", "post on social media", "post on facebook",
            "post on instagram", "intimate video", "intimate photos", "webcam recorded", "nude photos",
            "viral video", "ruin your reputation", "defame you", "pay ransom", "pay or i leak",
            "pay or we expose", "expose your secrets", "blackmail",
        ],
        category="personal_threat", weight=0.96,
    ),
    # --- Digital Arrest Indicators ---
    PatternDef(
        pattern_id="DA001", pattern_name="CBI & Law Enforcement Arrest Warrant",
        keywords=[
            "cbi arrest", "cbi warrant", "cbi officer", "cbi", "central bureau of investigation",
            "you have been arrested", "digital arrest", "cyber arrest", "under arrest",
            "arrest warrant", "arrested", "non-bailable arrest warrant", "cyber crime department",
            "crime branch", "arrest warrant issued", "chargesheet filed",
        ],
        category="digital_arrest", weight=0.95,
    ),
    PatternDef(
        pattern_id="DA002", pattern_name="Customs & Narcotics Seizure",
        keywords=[
            "customs seizure", "narcotics control", "package seized", "illegal parcel",
            "drug shipment", "customs department", "ncb arrest", "narcotics bureau",
            "customs parcel", "drugs found in parcel", "contraband seized",
        ],
        category="digital_arrest", weight=0.92,
    ),
    PatternDef(
        pattern_id="DA003", pattern_name="Police Enforcement & Legal Court Notice",
        keywords=[
            "police will arrive", "cops are coming", "fir registered", "non-bailable warrant",
            "nbw issued", "cybercrime fir", "police custody", "supreme court notice",
            "high court warrant", "court summons issued", "police inquiry",
        ],
        category="digital_arrest", weight=0.90,
    ),
    # --- Financial Extortion ---
    PatternDef(
        pattern_id="FE001", pattern_name="Immediate Money Transfer Demand",
        keywords=[
            "transfer money immediately", "send money now", "transfer to safe account",
            "safe account", "rbi safe account", "supreme court deposit", "pay fine immediately",
            "penalty payment", "settlement amount", "transfer rs", "pay immediately",
            "deposit money now", "pay fine or arrest", "transfer amount to avoid",
        ],
        category="financial_extortion", weight=0.92,
    ),
    PatternDef(
        pattern_id="FE002", pattern_name="Gift Card / Crypto Extortion",
        keywords=[
            "buy gift card", "send bitcoin", "send usdt", "crypto payment",
            "google play card", "itunes card", "amazon gift card payment",
            "transfer crypto", "pay in bitcoin",
        ],
        category="financial_extortion", weight=0.86,
    ),
    # --- Urgency Pressure ---
    PatternDef(
        pattern_id="UP001", pattern_name="Immediate Deadline / Panic Coercion",
        keywords=[
            "2 hour deadline", "two hour deadline", "within 2 hours", "within 1 hour",
            "30 minutes remaining", "last chance", "immediate action required",
            "do not delay", "act now or", "time is running out", "final warning",
            "last warning", "respond immediately",
        ],
        category="urgency_pressure", weight=0.78,
    ),
    PatternDef(
        pattern_id="UP002", pattern_name="Secrecy & Isolation Demand",
        keywords=[
            "do not tell anyone", "keep this confidential", "don't inform family",
            "don't call police", "stay on the call", "disconnect at your own risk",
            "do not disconnect video call", "remain in isolated room", "stay on camera",
        ],
        category="urgency_pressure", weight=0.82,
    ),
    # --- Authority Impersonation ---
    PatternDef(
        pattern_id="AI001", pattern_name="Government & Regulatory Impersonation",
        keywords=[
            "rrb officer", "income tax raid", "ed officer", "enforcement directorate",
            "trai", "telecom authority", "supreme court bench", "high court notice",
            "ministry of finance", "rbi verification",
        ],
        category="authority_impersonation", weight=0.87,
    ),
    PatternDef(
        pattern_id="AI002", pattern_name="SIM / Banking / Utility Deactivation Scam",
        keywords=[
            "sim will be blocked", "sim card blocked", "account will be frozen",
            "bank account suspended", "kyc suspended", "aadhaar flagged",
            "electricity will be disconnected", "electricity bill unpaid", "power cutoff tonight",
            "pan deactivated", "credit card blocked",
        ],
        category="authority_impersonation", weight=0.84,
    ),
]


# ---------------------------------------------------------------------------
# Semantic NLP & Sentence Meaning Extraction
# ---------------------------------------------------------------------------
def analyze_sentence_semantics(
    text: str,
    matched_patterns: List[ThreatPattern],
    threat_score: float,
) -> Tuple[Dict[str, Any], str, str]:
    """
    Analyzes the semantic grammar, intent, and deeper meaning of the message.
    Returns (semantic_data_dict, verdict, recommended_action).
    """
    text_lower = text.lower().strip()

    # Regex patterns for grammatical intent recognition
    has_death_threat = bool(
        re.search(r"\b(i\s+(will|shall|am\s+going\s+to|gonna)\s+(kill|murder|shoot|stab|harm|destroy|end|hurt|eliminate)\s+(you|u|your))\b", text_lower)
        or re.search(r"\b(kill\s+(you|u)|murder\s+you|death\s+threat|end\s+your\s+life|pay\s+or\s+die|shoot\s+you|stab\s+you|eliminate\s+you)\b", text_lower)
    )

    has_blackmail = bool(
        re.search(r"\b(leak|post|share|expose|send|publish)\s+(it|your\s+video|video|photo|photos|pics|webcam|pictures|secrets|mms|clip)\b", text_lower)
        or re.search(r"\b(recorded|captured|hacked)\s+(your\s+)?(video|webcam|screen|camera|clip)\b", text_lower)
        or re.search(r"\b(pay|send\s+money)\s+(or|if\s+you\s+do\s+not|if\s+you\s+don't)\s+.*(leak|send|post|expose|ruin|publish)\b", text_lower)
        or re.search(r"\b(leak|send|post)\s+.*(contacts|friends|family|facebook|instagram|social\s+media)\b", text_lower)
        or "blackmail" in text_lower or "ransom" in text_lower
    )

    has_digital_arrest = bool(
        any(p.category == "digital_arrest" for p in matched_patterns)
        or re.search(r"\b(digital\s+arrest|cbi|ncb|narcotics|customs|police|fir|warrant|chargesheet|crime\s+branch)\b", text_lower)
    )

    has_financial_demand = bool(
        any(p.category == "financial_extortion" for p in matched_patterns)
        or re.search(r"\b(transfer|send|pay|deposit)\s+(\d+|money|rs|inr|cash|fine|amount|crypto|bitcoin|usdt|card)\b", text_lower)
        or re.search(r"\b(if\s+you\s+(do\s+not|don't)\s+pay|pay\s+or\s+else)\b", text_lower)
    )

    has_utility_scam = bool(
        re.search(r"\b(electricity|power|sim|bill|kyc|pan|aadhaar)\s+(cutoff|disconnected|blocked|suspended|deactivated|frozen|unpaid)\b", text_lower)
    )

    # 1. Direct Death / Violence Threat
    if has_death_threat or any(p.pattern_id == "PT001" for p in matched_patterns):
        core_meaning = (
            "CRITICAL VIOLENCE THREAT: The sender is issuing an explicit, targeted threat of physical harm "
            "or death against the recipient ('" + text[:60] + ("..." if len(text) > 60 else "") + "')."
        )
        threat_level = "CRITICAL"
        threat_cat_label = "Direct Physical Harm / Death Threat"
        target_vector = "Personal Life & Physical Safety"
        coercion_tactic = "Criminal Intimidation & Death Threat (IPC Section 506 / BNS 351)"
        urgency = "CRITICAL"
        sentiment = "Highly Aggressive & Violent"
        verdict = "PERSONAL_THREAT_DETECTED"
        threat_score = max(threat_score, 0.99)
        action = (
            "EMERGENCY: Do NOT reply or confront sender. Immediately preserve screenshots and text evidence. "
            "Contact National Emergency (112) or Cybercrime Helpline (1930) and register a Police FIR."
        )

    # 2. Blackmail / Sextortion Threat
    elif has_blackmail or any(p.pattern_id == "BM001" for p in matched_patterns):
        core_meaning = (
            "EXTORTION & BLACKMAIL: The sender is threatening to publicly leak or distribute compromising media "
            "/ personal information unless monetary demands are met."
        )
        threat_level = "CRITICAL"
        threat_cat_label = "Blackmail & Sextortion"
        target_vector = "Personal Privacy & Reputation"
        coercion_tactic = "Defamation & Ransom Extortion (IT Act Section 67 / IPC 384)"
        urgency = "HIGH"
        sentiment = "Coercive & Intimidating"
        verdict = "SCAM_DETECTED"
        threat_score = max(threat_score, 0.95)
        action = (
            "CRITICAL: Do NOT transfer any money or gift cards. Block sender, preserve evidence, "
            "and file a cybercrime complaint at cybercrime.gov.in / call 1930."
        )

    # 3. Digital Arrest / Law Enforcement Impersonation
    elif has_digital_arrest and (threat_score > 0.40 or has_financial_demand):
        core_meaning = (
            "DIGITAL ARREST SCAM: The sender is impersonating law enforcement (CBI/Police/Customs) and fabricating "
            "fake legal warrants or drug seizures to intimidate the victim into transferring funds to a 'safe account'."
        )
        threat_level = "HIGH"
        threat_cat_label = "Digital Arrest Impersonation"
        target_vector = "Legal Liberty & Financial Assets"
        coercion_tactic = "Fake Authority Coercion & Fraudulent Warrants"
        urgency = "HIGH"
        sentiment = "Authoritative & Threatening"
        verdict = "DIGITAL_ARREST_DETECTED"
        threat_score = max(threat_score, 0.92)
        action = (
            "ALERT: Indian law enforcement NEVER conducts arrests via video call or demands money transfers. "
            "Hang up immediately, do NOT pay, and dial 1930."
        )

    # 4. Utility / Banking Suspension Scam
    elif has_utility_scam:
        core_meaning = (
            "UTILITY / KYC DISCONNECTION SCAM: The sender is fabricating an imminent service suspension "
            "(Electricity/SIM/Bank) to induce panic and force an unauthorized payment or link click."
        )
        threat_level = "HIGH"
        threat_cat_label = "Utility / Banking Panic Scam"
        target_vector = "Financial Credentials & Personal Identity"
        coercion_tactic = "False Urgency & Service Cutoff Panic"
        urgency = "HIGH"
        sentiment = "Deceptive & Urgent"
        verdict = "SCAM_DETECTED"
        threat_score = max(threat_score, 0.85)
        action = (
            "Do NOT click any links or call the number in the SMS. Verify your bill or KYC directly "
            "via official provider apps or portals."
        )

    # 5. General Scam / Extortion
    elif threat_score > 0.60 or matched_patterns:
        core_meaning = (
            "SUSPICIOUS COERCION: The message contains multiple indicators of social engineering, "
            "unsolicited urgency, or monetary demands."
        )
        threat_level = "ELEVATED"
        threat_cat_label = "Social Engineering & Extortion"
        target_vector = "Financial Assets"
        coercion_tactic = "Psychological Pressure & Urgency"
        urgency = "MEDIUM"
        sentiment = "Manipulative"
        verdict = "SCAM_DETECTED"
        action = "High scam probability. Do not comply with demands. Report to cybercrime 1930."

    # 6. Low / Safe
    elif threat_score > 0.25:
        core_meaning = "The message contains mild urgency or suspicious phrasing but no verified threat indicators."
        threat_level = "LOW"
        threat_cat_label = "Unverified Phrasing"
        target_vector = "General Inquiry"
        coercion_tactic = "None Detected"
        urgency = "LOW"
        sentiment = "Neutral"
        verdict = "SUSPICIOUS"
        action = "Exercise standard caution. Verify sender through trusted channels."
    else:
        core_meaning = "BENIGN / SAFE: Normal communication with zero extortion, violence, or impersonation markers detected."
        threat_level = "SAFE"
        threat_cat_label = "Benign Communication"
        target_vector = "None"
        coercion_tactic = "None"
        urgency = "LOW"
        sentiment = "Neutral / Non-Threatening"
        verdict = "SAFE"
        threat_score = 0.02
        action = "No threat indicators detected. Message appears safe."

    semantic_dict = {
        "core_meaning": core_meaning,
        "threat_level": threat_level,
        "threat_category_label": threat_cat_label,
        "target_vector": target_vector,
        "coercion_tactic": coercion_tactic,
        "urgency_level": urgency,
        "sentiment_polarity": sentiment,
    }

    return semantic_dict, verdict, action


# ---------------------------------------------------------------------------
# Pure Python Aho-Corasick Trie (Zero dependency fallback)
# ---------------------------------------------------------------------------
class _AhoNode:
    def __init__(self):
        self.children: Dict[str, _AhoNode] = {}
        self.fail: Optional[_AhoNode] = None
        self.outputs: List[Tuple[str, PatternDef]] = []


class _PurePyAhoCorasick:
    def __init__(self):
        self.root = _AhoNode()

    def add_word(self, word: str, pat_def: PatternDef):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = _AhoNode()
            node = node.children[ch]
        node.outputs.append((word, pat_def))

    def make_automaton(self):
        queue = deque()
        for ch, child in self.root.children.items():
            child.fail = self.root
            queue.append(child)

        while queue:
            current = queue.popleft()
            for ch, child in current.children.items():
                fail_node = current.fail
                while fail_node and ch not in fail_node.children:
                    fail_node = fail_node.fail
                child.fail = fail_node.children[ch] if fail_node else self.root
                child.outputs.extend(child.fail.outputs)
                queue.append(child)

    def iter(self, text: str):
        node = self.root
        for idx, ch in enumerate(text):
            while node and ch not in node.children:
                node = node.fail
            if not node:
                node = self.root
                continue
            node = node.children[ch]
            for kw, pat_def in node.outputs:
                yield idx, (0, kw, pat_def)


# ---------------------------------------------------------------------------
# Automaton Builder & SMSShield Engine
# ---------------------------------------------------------------------------
class SMSShield:
    """Aho-Corasick automaton + Semantic Intent Parser."""

    def __init__(self) -> None:
        if ahocorasick is not None:
            self._automaton: Any = ahocorasick.Automaton()
            self._use_c_ext = True
        else:
            self._automaton = _PurePyAhoCorasick()
            self._use_c_ext = False
        self._pattern_map: Dict[str, PatternDef] = {}
        self._build_automaton()

    def _build_automaton(self) -> None:
        idx = 0
        for pat_def in PATTERN_DEFINITIONS:
            for kw in pat_def.keywords:
                kw_lower = kw.lower()
                if self._use_c_ext:
                    if kw_lower in self._automaton:
                        existing = self._pattern_map.get(kw_lower)
                        if existing and pat_def.weight > existing.weight:
                            self._pattern_map[kw_lower] = pat_def
                    else:
                        self._automaton.add_word(kw_lower, (idx, kw_lower, pat_def))
                        self._pattern_map[kw_lower] = pat_def
                        idx += 1
                else:
                    self._automaton.add_word(kw_lower, pat_def)
                    self._pattern_map[kw_lower] = pat_def
                    idx += 1

        self._automaton.make_automaton()
        logger.info(
            "SMS Shield automaton initialized: %d keywords mapped across %d pattern groups (C-ext: %s)",
            idx, len(PATTERN_DEFINITIONS), self._use_c_ext,
        )

    def scan(self, request: MessageScanRequest) -> MessageScanResponse:
        t_start = time.perf_counter()
        text_lower = request.text.lower()
        text_hash = hashlib.sha256(request.text.encode()).hexdigest()

        matched: Dict[str, ThreatPattern] = {}
        for end_idx, (_, kw, pat_def) in self._automaton.iter(text_lower):
            start_idx = end_idx - len(kw) + 1
            fragment = request.text[start_idx: end_idx + 1]

            key = pat_def.pattern_id
            if key not in matched or pat_def.weight > matched[key].weight:
                matched[key] = ThreatPattern(
                    pattern_id=pat_def.pattern_id,
                    pattern_name=pat_def.pattern_name,
                    matched_fragment=fragment[:256],
                    category=pat_def.category,  # type: ignore[arg-type]
                    weight=pat_def.weight,
                )

        pattern_list = sorted(matched.values(), key=lambda p: p.weight, reverse=True)

        # Fused threat score: 1 - product of (1 - weight)
        threat_score: float = 0.0
        if pattern_list:
            from functools import reduce
            import operator
            complement_product = reduce(
                operator.mul,
                [1.0 - p.weight for p in pattern_list],
                1.0,
            )
            threat_score = round(1.0 - complement_product, 4)

        # Run Semantic NLP Parser to extract deeper intent and sentence meaning
        semantic_data, verdict, action = analyze_sentence_semantics(
            request.text, pattern_list, threat_score
        )

        elapsed_ms = (time.perf_counter() - t_start) * 1000

        from backend.schemas.message import SemanticAnalysis
        semantic_obj = SemanticAnalysis(**semantic_data)

        return MessageScanResponse(
            text_hash=text_hash,
            source_channel=request.source_channel,
            matched_patterns=pattern_list,
            total_patterns_matched=len(pattern_list),
            threat_score=threat_score,
            verdict=verdict,  # type: ignore[arg-type]
            recommended_action=action,
            scan_ms=round(elapsed_ms, 4),
            semantic_analysis=semantic_obj,
        )


# Singleton instance
_shield_instance: SMSShield | None = None


def get_sms_shield() -> SMSShield:
    """Return or build the singleton SMSShield instance."""
    global _shield_instance  # noqa: PLW0603
    if _shield_instance is None:
        _shield_instance = SMSShield()
    return _shield_instance
