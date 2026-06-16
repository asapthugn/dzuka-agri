"use client";

import { useState, useEffect, useRef, useCallback, lazy, Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import FarmChat from "@/components/FarmChat";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import {
  Sprout, Bug, CloudSun, TrendingUp, MapPin, CheckCircle,
  Loader2, Upload, X, ArrowRight, TriangleAlert, Copy, Printer, FlaskConical, Map,
} from "lucide-react";

// Dynamically import the map to avoid SSR issues with Leaflet
const FarmMap = dynamic(() => import("@/components/FarmMap"), { ssr: false, loading: () => (
  <div className="h-56 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
    <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
  </div>
)});

const CROPS = ["Maize", "Rice", "Wheat", "Cotton", "Soybean", "Groundnut", "Tobacco"];

const DEMO = {
  crop: "Maize",
  lat: 34.5587,
  lng: 72.5000,
  symptoms: "Leaves showing yellowing between veins (interveinal chlorosis), small dark spots on older leaves, cobs not filling properly. Problem visible in the lower part of the field near the stream. Recent heavy pre-monsoon rains in Buner.",
};

const AGENTS = [
  {
    name: "Agronomy Agent",
    icon: Sprout,
    agentKey: "agronomy",
    label: "Soil & Farming",
    color: "text-green-700",
    iconBg: "bg-green-100",
    bg: "bg-gradient-to-br from-green-50 to-white",
    border: "border-green-200",
  },
  {
    name: "Climate Agent",
    icon: CloudSun,
    agentKey: "climate",
    label: "Weather & Climate",
    color: "text-sky-600",
    iconBg: "bg-sky-100",
    bg: "bg-gradient-to-br from-sky-50 to-white",
    border: "border-sky-200",
  },
  {
    name: "Pest & Disease Agent",
    icon: Bug,
    agentKey: "pest",
    label: "Pest Diagnosis",
    color: "text-red-600",
    iconBg: "bg-red-100",
    bg: "bg-gradient-to-br from-red-50 to-white",
    border: "border-red-200",
  },
  {
    name: "Market Agent",
    icon: TrendingUp,
    agentKey: "market",
    label: "Market & Prices",
    color: "text-amber-600",
    iconBg: "bg-amber-100",
    bg: "bg-gradient-to-br from-amber-50 to-white",
    border: "border-amber-200",
  },
];

/* Styled markdown components — no typography plugin needed */
const mkd: Components = {
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-gray-900 mt-4 mb-1.5 pb-1 border-b border-gray-100 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-gray-800 mt-3 mb-1">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside pl-4 space-y-1 mb-3">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside pl-4 space-y-1 mb-3">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-gray-700 leading-relaxed">{children}</li>
  ),
  p: ({ children }) => (
    <p className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
};

type AgentKey = "agronomy" | "climate" | "pest" | "market";
type AgentOutputs = Partial<Record<AgentKey, string>>;
type MatchedRegion = { region: string; region_code: string; distance_km: number } | null;

export default function AnalyzePage() {
  const [crop, setCrop] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [matchedRegion, setMatchedRegion] = useState<MatchedRegion>(null);
  const [symptoms, setSymptoms] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentKey | "review" | null>(null);
  const [agentOutputs, setAgentOutputs] = useState<AgentOutputs>({});
  const [streamingText, setStreamingText] = useState("");
  const [isDone, setIsDone] = useState(false);
  const [chatSuggestions, setChatSuggestions] = useState<string[]>([]);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<Record<string, unknown> | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const streamEndRef = useRef<HTMLDivElement>(null);

  const lookupRegion = useCallback(async (latitude: number, longitude: number) => {
    setGeoLoading(true);
    try {
      const res = await fetch("/api/geo/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
      if (res.ok) setGeoData(await res.json());
    } catch { /* silent */ } finally { setGeoLoading(false); }
  }, []);

  useEffect(() => {
    if (lat === null || lng === null) return;
    const t = setTimeout(() => lookupRegion(lat, lng), 600);
    return () => clearTimeout(t);
  }, [lat, lng, lookupRegion]);

  useEffect(() => {
    if (streamingText) streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [streamingText]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported."); return; }
    setLocating(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const la = parseFloat(pos.coords.latitude.toFixed(4));
        const lo = parseFloat(pos.coords.longitude.toFixed(4));
        setLat(la); setLng(lo); setLocating(false); setShowMap(true);
        lookupRegion(la, lo);
      },
      () => { setLocError("Could not detect location. Enter coordinates manually."); setLocating(false); }
    );
  }, [lookupRegion]);

  const handleMapClick = (la: number, lo: number) => {
    setLat(la); setLng(lo);
    lookupRegion(la, lo);
  };

  const fillDemo = () => {
    setCrop(DEMO.crop); setLat(DEMO.lat); setLng(DEMO.lng);
    setSymptoms(DEMO.symptoms); setGeoData(null); setShowMap(true);
    lookupRegion(DEMO.lat, DEMO.lng);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop) { setValidationMsg("Please select a crop."); return; }
    if (lat === null || lng === null) { setValidationMsg("Please detect or enter your location."); return; }

    setValidationMsg(""); setLoading(true); setError(null);
    setAgentOutputs({}); setStreamingText(""); setIsDone(false);
    setImageAnalysis(null); setActiveAgent(null); setMatchedRegion(null); setChatSuggestions([]);

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);

    if (image) {
      const fd = new FormData(); fd.append("file", image);
      fetch(`/api/analyze-image?crop=${crop.toLowerCase()}`, { method: "POST", body: fd })
        .then((r) => r.ok ? r.json() : null)
        .then((d) => d && setImageAnalysis(d.analysis))
        .catch(() => null);
    }

    try {
      const res = await fetch("/api/recommendation/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop: crop.toLowerCase(), symptoms, latitude: lat, longitude: lng }),
      });

      if (!res.ok || !res.body) {
        setError("Analysis failed. Make sure the backend is running on port 8000.");
        setLoading(false); return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const ev = JSON.parse(line.slice(6));
            if (ev.type === "region") {
              setMatchedRegion({ region: ev.region, region_code: ev.region_code, distance_km: ev.distance_km });
            } else if (ev.type === "agent") {
              setActiveAgent(ev.agent as AgentKey);
              setAgentOutputs((p) => ({ ...p, [ev.agent]: ev.content }));
            } else if (ev.type === "stream_start") {
              setActiveAgent("review");
            } else if (ev.type === "token") {
              setStreamingText((p) => p + ev.content);
            } else if (ev.type === "suggestions") {
              setChatSuggestions(ev.items || []);
            } else if (ev.type === "done") {
              setIsDone(true); setLoading(false); setActiveAgent(null);
            } else if (ev.type === "error") {
              setError(ev.content); setLoading(false);
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch {
      setError("Could not connect to the backend. Make sure it is running on port 8000.");
      setLoading(false);
    }
  };

  const reset = () => {
    setCrop(""); setLat(null); setLng(null); setSymptoms("");
    setImage(null); setImagePreview(null); setAgentOutputs({});
    setStreamingText(""); setIsDone(false); setImageAnalysis(null);
    setError(null); setGeoData(null); setValidationMsg(""); setActiveAgent(null); setShowMap(false); setMatchedRegion(null); setChatSuggestions([]);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(streamingText);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const hasResults = Object.keys(agentOutputs).length > 0 || streamingText || imageAnalysis;
  const geoRegion = (geoData?.nearest_region as Record<string, string> | undefined);
  const geoSoil = (geoData?.soil as Record<string, string> | undefined);
  const geoWeather = (geoData?.weather as Record<string, string> | undefined);

  return (
    <div className="flex flex-col min-h-full bg-surface">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analyze Your Farm</h1>
            <p className="text-gray-500">Our 5-agent AI team will analyze your crop, soil, climate, pests, and market.</p>
          </div>
          <button type="button" onClick={fillDemo}
            className="inline-flex items-center gap-2 text-sm bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-4 py-2 rounded-xl transition-colors border border-amber-200 flex-shrink-0">
            <FlaskConical className="w-4 h-4" /> Try Demo
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Crop */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Crop Type <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CROPS.map((c) => (
                <button key={c} type="button" onClick={() => setCrop(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    crop === c
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Farm Location <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {/* Detect + show map toggle */}
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={detectLocation} disabled={locating}
                  className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                  {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {locating ? "Detecting…" : "Detect My Location"}
                </button>
                {lat !== null && lng !== null && (
                  <button type="button" onClick={() => setShowMap((v) => !v)}
                    className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors">
                    <Map className="w-4 h-4" />
                    {showMap ? "Hide Map" : "Show on Map"}
                  </button>
                )}
              </div>

              {locError && (
                <p className="text-red-500 text-sm flex items-center gap-1.5">
                  <TriangleAlert className="w-3.5 h-3.5" />{locError}
                </p>
              )}

              {/* Coordinate inputs */}
              <div className="flex gap-3">
                <input type="number" step="any" placeholder="Latitude (e.g. -13.9)"
                  value={lat ?? ""}
                  onChange={(e) => { setLat(e.target.value ? parseFloat(e.target.value) : null); setShowMap(true); }}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                <input type="number" step="any" placeholder="Longitude (e.g. 33.7)"
                  value={lng ?? ""}
                  onChange={(e) => { setLng(e.target.value ? parseFloat(e.target.value) : null); setShowMap(true); }}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>

              {/* Interactive map */}
              {showMap && lat !== null && lng !== null && (
                <div className="space-y-1.5">
                  <p className="text-xs text-gray-400">Click anywhere on the map to adjust your farm location.</p>
                  <FarmMap lat={lat} lng={lng} onChange={handleMapClick} />
                </div>
              )}

              {/* Region badges */}
              {lat !== null && lng !== null && (
                <div className="flex items-center flex-wrap gap-2 pt-1">
                  <div className="text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-full inline-flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />{lat}, {lng}
                    {geoLoading && <Loader2 className="w-3 h-3 animate-spin ml-0.5" />}
                  </div>
                  {(geoData?.location as string) && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                      📍 {geoData?.location as string}
                    </span>
                  )}
                  {(geoData?.weather as Record<string, number>)?.temp_c !== undefined && (
                    <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-medium border border-sky-100">
                      🌤 {(geoData?.weather as Record<string, number>).temp_c}°C · 💧 {(geoData?.weather as Record<string, number>).humidity_pct}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              What are you observing? <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea rows={4} value={symptoms} onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe symptoms, e.g. yellow leaves on lower stalks, brown patches, stunted growth."
              className="w-full text-sm border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Upload a photo <span className="text-gray-400 font-normal">(optional — Vision analysis)</span>
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Crop preview" className="w-48 h-48 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-red-50">
                  <X className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed border-gray-200 hover:border-primary/40 rounded-xl py-10 text-gray-400 hover:text-primary transition-colors">
                <Upload className="w-6 h-6" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs">JPG, PNG, WEBP up to 10MB</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)} />
          </div>

          {validationMsg && (
            <p className="text-red-500 text-sm flex items-center gap-2">
              <TriangleAlert className="w-4 h-4" />{validationMsg}
            </p>
          )}

          <button type="submit" disabled={!crop || lat === null || lng === null || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" />Agents are working…</>
              : <><span>Analyze Now</span><ArrowRight className="w-4 h-4" /></>
            }
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-8 bg-red-50 border border-red-100 rounded-2xl p-5 flex gap-3">
            <TriangleAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">Analysis failed</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={resultsRef}>
          {hasResults && (
            <div className="mt-12 space-y-5">

              {/* Matched region banner */}
              {matchedRegion && (
                <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm border ${
                  matchedRegion.distance_km > 200
                    ? "bg-amber-50 border-amber-200 text-amber-800"
                    : "bg-green-50 border-green-200 text-green-800"
                }`}>
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Analysis region: {matchedRegion.region}</span>
                    {matchedRegion.distance_km > 200 && (
                      <p className="text-xs mt-0.5 opacity-80">
                        Nearest match found ({matchedRegion.distance_km} km away). Soil & market data are approximate for your location.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-foreground">Your Action Plan</h2>
                {isDone && (
                  <div className="flex items-center gap-2">
                    <button onClick={copyToClipboard}
                      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary border border-gray-200 hover:border-primary px-3 py-1.5 rounded-lg transition-colors">
                      <Copy className="w-3.5 h-3.5" />{copied ? "Copied!" : "Copy"}
                    </button>
                    <button onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary border border-gray-200 hover:border-primary px-3 py-1.5 rounded-lg transition-colors">
                      <Printer className="w-3.5 h-3.5" />Print
                    </button>
                    <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                      New Analysis
                    </button>
                  </div>
                )}
              </div>

              {/* Vision */}
              {imageAnalysis && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Bug className="w-3.5 h-3.5 text-amber-600" />
                    </span>
                    <span className="text-sm font-semibold text-amber-800">Visual Crop Analysis</span>
                  </div>
                  <ReactMarkdown components={mkd}>{imageAnalysis}</ReactMarkdown>
                </div>
              )}

              {/* Agent cards — appear one by one as each agent finishes */}
              {AGENTS.map((agent) => {
                const content = agentOutputs[agent.agentKey as AgentKey];
                const isRunning = activeAgent === agent.agentKey && !content;
                if (!content && !isRunning) return null;

                return (
                  <div key={agent.name} className={`${agent.bg} border ${agent.border} rounded-2xl overflow-hidden`}>
                    {/* Card header */}
                    <div className={`flex items-center gap-3 px-5 py-3.5 border-b ${agent.border}`}>
                      <span className={`w-7 h-7 ${agent.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <agent.icon className={`w-3.5 h-3.5 ${agent.color}`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${agent.color}`}>{agent.name}</p>
                        <p className="text-xs text-gray-400">{agent.label}</p>
                      </div>
                      {content && <CheckCircle className={`w-4 h-4 ${agent.color} flex-shrink-0`} />}
                      {isRunning && <Loader2 className={`w-4 h-4 ${agent.color} animate-spin flex-shrink-0`} />}
                    </div>
                    {/* Card body */}
                    <div className="px-5 py-4">
                      {content
                        ? <ReactMarkdown components={mkd}>{content}</ReactMarkdown>
                        : <p className="text-xs text-gray-400 italic">Analyzing…</p>
                      }
                    </div>
                  </div>
                );
              })}

              {/* Final action plan — streams token by token */}
              {(streamingText || activeAgent === "review") && (
                <div className="bg-white border-2 border-primary/30 rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex items-center gap-3 px-5 py-3.5 bg-primary/5 border-b border-primary/15">
                    <span className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-primary">Final Action Plan</p>
                      <p className="text-xs text-gray-400">Decision Review Agent · All 4 agents synthesized</p>
                    </div>
                    {!isDone && <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />}
                    {isDone && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                  </div>
                  <div className="px-5 py-4">
                    <ReactMarkdown components={mkd}>{streamingText}</ReactMarkdown>
                    {!isDone && (
                      <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                    )}
                    <div ref={streamEndRef} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-primary-dark py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/40 text-xs">Dzuka Agri</div>
      </footer>

      {/* Farm Advisor chatbot — only appears after analysis is complete */}
      {isDone && (
        <FarmChat
          context={{
            agronomy: agentOutputs.agronomy,
            climate: agentOutputs.climate,
            pest: agentOutputs.pest,
            market: agentOutputs.market,
            recommendation: streamingText,
          }}
          crop={crop}
          location={matchedRegion?.region || (geoData?.location as string) || ""}
          suggestions={chatSuggestions}
        />
      )}
    </div>
  );
}
