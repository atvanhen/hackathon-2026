"""
Scam Sherlock — FastAPI Backend
Real-time scam link detection with Playwright screenshot capture.
"""

import base64
import uuid
import random
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from playwright.sync_api import sync_playwright

# ─── App setup ───────────────────────────────────────────────────────────────

app = FastAPI(title="Scam Sherlock API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-memory store (TODO: replace with Supabase) ──────────────────────────

scan_results: list[dict] = []

# ─── Models ──────────────────────────────────────────────────────────────────


class ScanRequest(BaseModel):
    url: str  # Using str for flexibility; validated by Playwright navigating to it


class ScanResponse(BaseModel):
    id: str
    url: str
    timestamp: str
    screenshot_base64: str
    threat_level: str  # "safe" | "suspicious" | "dangerous"
    risk_score: int  # 0-100
    verdict: str


# ─── Threat analysis (mock — TODO: integrate Gemini Vision API) ─────────────


def analyze_threat(url: str, _screenshot_bytes: bytes) -> dict:
    """
    Mock threat analysis. In production, this would:
    1. Send the screenshot to Google Gemini Vision API
    2. Ask it to identify phishing indicators, fake login forms, etc.
    3. Return a structured threat assessment

    TODO: Replace with actual Gemini Vision API call:
        import google.generativeai as genai
        genai.configure(api_key=os.environ["GEMINI_API_KEY"])
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content([
            "Analyze this screenshot for phishing/scam indicators...",
            {"mime_type": "image/png", "data": screenshot_bytes}
        ])
    """
    # Mock scoring based on URL heuristics for demo
    score = random.randint(5, 95)

    suspicious_keywords = [
        "login", "verify", "secure", "account", "update", "confirm",
        "bank", "paypal", "amazon", "microsoft", "apple", "netflix",
        "free", "winner", "prize", "urgent", "suspended",
    ]

    url_lower = url.lower()
    keyword_hits = sum(1 for kw in suspicious_keywords if kw in url_lower)

    if keyword_hits >= 2:
        score = min(score + 30, 98)
    elif keyword_hits == 1:
        score = min(score + 15, 85)

    # Determine threat level
    if score >= 70:
        threat_level = "dangerous"
        verdicts = [
            "High-risk page detected. Multiple phishing indicators found including suspicious form elements and misleading branding.",
            "This URL exhibits characteristics commonly associated with credential harvesting attacks.",
            "WARNING: Page contains elements consistent with known scam templates. Do not enter personal information.",
        ]
    elif score >= 40:
        threat_level = "suspicious"
        verdicts = [
            "Several elements on this page warrant caution. The domain structure and content raise moderate concerns.",
            "This page has some unusual characteristics. Proceed with caution and avoid submitting sensitive data.",
            "Mixed signals detected. While not definitively malicious, this page shows some red flags worth noting.",
        ]
    else:
        threat_level = "safe"
        verdicts = [
            "This page appears legitimate. No significant phishing or scam indicators were detected.",
            "Low risk assessment. The page structure and content appear consistent with legitimate sites.",
            "Page scan complete. No immediate threats detected, but always exercise caution online.",
        ]

    return {
        "threat_level": threat_level,
        "risk_score": score,
        "verdict": random.choice(verdicts),
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
    1. Launch headless Chromium with Playwright
    2. Navigate to the URL and wait for network idle
    3. Capture a full-page screenshot
    4. Analyze the page for threats (mock for MVP)
    5. Return the result
    """
    url = req.url

    # Ensure URL has a scheme
    if not url.startswith(("http://", "https://")):
        url = f"https://{url}"

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                viewport={"width": 1280, "height": 800},
                user_agent=(
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                    "AppleWebKit/537.36 (KHTML, like Gecko) "
                    "Chrome/120.0.0.0 Safari/537.36"
                ),
            )
            page = context.new_page()

            # Navigate with timeout
            page.goto(url, wait_until="networkidle", timeout=30000)

            # Take full-page screenshot as bytes
            screenshot_bytes = page.screenshot(full_page=True, type="png")

            browser.close()

    except Exception as e:
        raise HTTPException(
            status_code=422,
            detail=f"Failed to capture screenshot: {str(e)}",
        )

    # Analyze the screenshot for threats
    analysis = analyze_threat(url, screenshot_bytes)

    # Build result
    result = {
        "id": str(uuid.uuid4()),
        "url": url,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "screenshot_base64": base64.b64encode(screenshot_bytes).decode("utf-8"),
        "threat_level": analysis["threat_level"],
        "risk_score": analysis["risk_score"],
        "verdict": analysis["verdict"],
    }

    # Store (TODO: persist to Supabase)
    scan_results.append(result)

    return result
