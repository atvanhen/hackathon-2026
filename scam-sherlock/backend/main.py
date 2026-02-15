"""
Scam Sherlock — FastAPI Backend
Real-time scam link detection with Playwright screenshot capture + Gemini Vision AI.
"""

import base64
import json
import os
import re
import uuid
from datetime import datetime, timezone
from pathlib import Path

import google.generativeai as genai
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from playwright.sync_api import sync_playwright
from pydantic import BaseModel

# Load .env from the same directory as this file
load_dotenv(Path(__file__).resolve().parent / ".env")

# ─── App setup ───────────────────────────────────────────────────────────────

app = FastAPI(title="Scam Sherlock API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Gemini setup ────────────────────────────────────────────────────────────

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# ─── In-memory store (TODO: replace with Supabase) ──────────────────────────

scan_results: list[dict] = []

# ─── Models ──────────────────────────────────────────────────────────────────


class ScanRequest(BaseModel):
    url: str


class ScanResponse(BaseModel):
    id: str
    url: str
    timestamp: str
    screenshot_base64: str
    threat_level: str       # "safe" | "suspicious" | "dangerous"
    risk_score: int          # 0-100
    verdict: str
    findings: list[str]      # Detailed analysis points


# ─── HTML signal extraction ──────────────────────────────────────────────────

EXTRACTION_SCRIPT = """
() => {
    const signals = {};

    // Basic page info
    signals.title = document.title || '';
    signals.finalUrl = window.location.href;

    // Forms analysis
    const forms = document.querySelectorAll('form');
    signals.formCount = forms.length;
    signals.formActions = [...forms].map(f => f.action || 'none').slice(0, 5);
    signals.formMethods = [...forms].map(f => f.method || 'get').slice(0, 5);

    // Input field analysis
    const inputs = document.querySelectorAll('input');
    signals.inputTypes = [...inputs].map(i => i.type).slice(0, 15);
    signals.hasPasswordField = !!document.querySelector('input[type="password"]');
    signals.hasEmailField = !!document.querySelector('input[type="email"]');
    signals.hasHiddenFields = document.querySelectorAll('input[type="hidden"]').length;

    // Suspicious text patterns
    const bodyText = document.body?.innerText?.substring(0, 3000) || '';
    signals.bodyTextSample = bodyText;

    // Links analysis
    const links = document.querySelectorAll('a[href]');
    signals.totalLinks = links.length;
    const externalLinks = [...links].filter(a => {
        try { return new URL(a.href).hostname !== window.location.hostname; }
        catch { return false; }
    });
    signals.externalLinkCount = externalLinks.length;
    signals.externalDomains = [...new Set(externalLinks.map(a => {
        try { return new URL(a.href).hostname; } catch { return 'invalid'; }
    }))].slice(0, 10);

    // Script analysis
    const scripts = document.querySelectorAll('script');
    signals.scriptCount = scripts.length;
    signals.externalScripts = [...scripts]
        .filter(s => s.src)
        .map(s => s.src)
        .slice(0, 10);

    // iframes
    const iframes = document.querySelectorAll('iframe');
    signals.iframeCount = iframes.length;
    signals.iframeSources = [...iframes].map(f => f.src || 'about:blank').slice(0, 5);

    // Meta tags
    const metas = document.querySelectorAll('meta');
    signals.metaTags = [...metas].map(m => ({
        name: m.name || m.getAttribute('property') || '',
        content: (m.content || '').substring(0, 100)
    })).filter(m => m.name).slice(0, 10);

    // SSL/security indicators in content
    signals.mentionsSecurity = /secur|ssl|encrypt|protect|verif/i.test(bodyText);
    signals.mentionsUrgency = /urgent|immediate|suspend|locked|expire|act now|limited time/i.test(bodyText);
    signals.mentionsCredentials = /password|login|sign.?in|credential|username|account/i.test(bodyText);
    signals.mentionsFinancial = /bank|credit.?card|paypal|payment|billing|wire|transfer|bitcoin|crypto/i.test(bodyText);

    return signals;
}
"""


def extract_page_signals(page) -> dict:
    """Extract lightweight security-relevant signals from the page DOM."""
    try:
        return page.evaluate(EXTRACTION_SCRIPT)
    except Exception:
        return {"error": "Failed to extract page signals"}


# ─── Gemini Vision threat analysis ───────────────────────────────────────────

ANALYSIS_PROMPT = """You are a cybersecurity analyst specializing in phishing and scam detection.

Analyze the provided webpage screenshot AND the extracted HTML signals below. Determine whether this page is a scam, phishing attempt, or legitimate site.

**Extracted HTML Signals:**
```json
{signals_json}
```

**Your analysis must consider:**
1. Visual indicators: Does the page impersonate a known brand? Are there fake login forms? Urgent/threatening language?
2. HTML structure: Are there hidden form fields? Do forms submit to suspicious domains? Are password/email inputs present?
3. Content patterns: Does the text use urgency tactics? References to account suspension, prizes, or financial information?
4. Technical signals: Suspicious scripts, iframes, or external domains?

**Respond with ONLY valid JSON in this exact format (no markdown, no code fences):**
{{
    "threat_level": "safe" | "suspicious" | "dangerous",
    "risk_score": <integer 0-100>,
    "verdict": "<1-2 sentence summary of overall assessment>",
    "findings": [
        "<specific finding 1 about what the page is doing or trying to do>",
        "<specific finding 2>",
        "<specific finding 3>"
    ]
}}

Provide 3-6 specific, actionable findings. Each finding should explain WHAT was detected and WHY it matters.
Be concise but specific. If the page is safe, explain what makes it trustworthy.
"""


def analyze_with_gemini(screenshot_bytes: bytes, page_signals: dict) -> dict:
    """Send screenshot + HTML signals to Gemini Vision for analysis."""
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not set")

    model = genai.GenerativeModel("gemini-flash-latest")

    # Truncate body text to avoid huge payloads
    if "bodyTextSample" in page_signals:
        page_signals["bodyTextSample"] = page_signals["bodyTextSample"][:2000]

    signals_json = json.dumps(page_signals, indent=2, default=str)

    prompt = ANALYSIS_PROMPT.replace("{signals_json}", signals_json)

    response = model.generate_content([
        prompt,
        {"mime_type": "image/png", "data": screenshot_bytes},
    ])

    # Parse the JSON response
    text = response.text.strip()
    # Strip markdown code fences if Gemini wraps them anyway
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        # Fallback if Gemini returns malformed JSON
        result = {
            "threat_level": "suspicious",
            "risk_score": 50,
            "verdict": "Analysis completed but response parsing failed. Manual review recommended.",
            "findings": ["AI analysis returned an unparseable response. The page should be reviewed manually."],
        }

    # Validate and clamp values
    valid_levels = {"safe", "suspicious", "dangerous"}
    if result.get("threat_level") not in valid_levels:
        result["threat_level"] = "suspicious"
    result["risk_score"] = max(0, min(100, int(result.get("risk_score", 50))))
    if not isinstance(result.get("findings"), list):
        result["findings"] = [result.get("verdict", "No findings available.")]

    return result


def analyze_fallback(url: str, page_signals: dict) -> dict:
    """Heuristic-based fallback when Gemini API key is not available."""
    score = 10
    findings = []

    # Check for password fields
    if page_signals.get("hasPasswordField"):
        score += 20
        findings.append("Page contains a password input field — could be a login or credential harvesting form.")

    # Check for hidden fields
    hidden = page_signals.get("hasHiddenFields", 0)
    if hidden > 3:
        score += 15
        findings.append(f"Found {hidden} hidden form fields — often used to pass tracking data or disguise form submissions.")

    # Check urgency language
    if page_signals.get("mentionsUrgency"):
        score += 20
        findings.append("Page uses urgency language (e.g., 'suspended', 'act now', 'limited time') — a common social engineering tactic.")

    # Check credential mentions
    if page_signals.get("mentionsCredentials"):
        score += 10
        findings.append("Page references credentials, login, or account information.")

    # Check financial mentions
    if page_signals.get("mentionsFinancial"):
        score += 15
        findings.append("Page mentions financial terms (banking, payment, credit card) — potential financial phishing.")

    # Check forms submitting to external domains
    form_actions = page_signals.get("formActions", [])
    final_url = page_signals.get("finalUrl", url)
    for action in form_actions:
        if action and action != "none" and final_url:
            try:
                from urllib.parse import urlparse
                action_host = urlparse(action).hostname
                page_host = urlparse(final_url).hostname
                if action_host and page_host and action_host != page_host:
                    score += 25
                    findings.append(f"Form submits data to a different domain ({action_host}) — strong phishing indicator.")
                    break
            except Exception:
                pass

    # Iframes
    iframe_count = page_signals.get("iframeCount", 0)
    if iframe_count > 0:
        score += 10
        findings.append(f"Page contains {iframe_count} iframe(s) — could be used to embed malicious content or overlay attacks.")

    # External scripts
    ext_scripts = page_signals.get("externalScripts", [])
    if len(ext_scripts) > 5:
        score += 10
        findings.append(f"Page loads {len(ext_scripts)} external scripts — increases attack surface.")

    if not findings:
        findings.append("No significant threat indicators detected in the page structure or content.")
        findings.append("Page structure appears consistent with legitimate websites.")

    score = min(score, 100)

    if score >= 70:
        threat_level = "dangerous"
        verdict = "High-risk page detected. Multiple phishing indicators found in page structure and content."
    elif score >= 40:
        threat_level = "suspicious"
        verdict = "This page shows some concerning characteristics. Proceed with caution."
    else:
        threat_level = "safe"
        verdict = "This page appears legitimate. No significant threat indicators were detected."

    return {
        "threat_level": threat_level,
        "risk_score": score,
        "verdict": verdict,
        "findings": findings,
    }


# ─── Routes ──────────────────────────────────────────────────────────────────


@app.get("/api/scans")
def get_scans():
    """Return all scan results, most recent first."""
    return list(reversed(scan_results))


@app.post("/api/scan", response_model=ScanResponse)
def create_scan(req: ScanRequest):
    """
    Scan a URL:
    1. Launch headless Chromium via Playwright
    2. Navigate & wait for network idle
    3. Extract HTML signals from the live DOM
    4. Capture a full-page screenshot
    5. Send screenshot + signals to Gemini Vision (or fallback to heuristics)
    6. Return structured threat assessment
    """
    url = req.url

    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"

    page_signals = {}
    screenshot_bytes = b""

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
                ignore_https_errors=True,
                java_script_enabled=True,
            )
            page = context.new_page()

            # Add stealth scripts to hide automation
            page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")

            # Increased timeout for heavy sites like people.com
            page.goto(url, wait_until="domcontentloaded", timeout=60000)

            # Extract HTML signals from the page
            page_signals = extract_page_signals(page)

            # Capture screenshot (viewport only, to ensure consistent aspect ratio)
            screenshot_bytes = page.screenshot(full_page=False, type="png")

            browser.close()

    except Exception as e:
        # If site is unreachable, return a structured error result instead of crashing
        print(f"Playwright failed: {e}")
        error_result = {
            "id": str(uuid.uuid4()),
            "url": url,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "screenshot_base64": "",  # No screenshot available
            "threat_level": "suspicious",
            "risk_score": 75,
            "verdict": "Scan Failed - Site Unreachable",
            "findings": [
                "The website could not be accessed.",
                "It might be offline, blocking automated scanners, or taken down due to malicious activity.",
                "Proceed with extreme caution."
            ]
        }
        scan_results.append(error_result)
        return error_result

    # Analyze with Gemini or fallback
    try:
        if GEMINI_API_KEY:
            analysis = analyze_with_gemini(screenshot_bytes, page_signals)
        else:
            analysis = analyze_fallback(url, page_signals)
    except Exception as e:
        # If Gemini fails, fall back to heuristic analysis
        print(f"Gemini analysis failed: {e}, using fallback")
        analysis = analyze_fallback(url, page_signals)

    result = {
        "id": str(uuid.uuid4()),
        "url": url,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "screenshot_base64": base64.b64encode(screenshot_bytes).decode("utf-8"),
        "threat_level": analysis["threat_level"],
        "risk_score": analysis["risk_score"],
        "verdict": analysis["verdict"],
        "findings": analysis.get("findings", []),
    }

    scan_results.append(result)

    return result
