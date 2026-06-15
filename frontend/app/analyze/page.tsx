"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import {
  Sprout, Bug, CloudSun, TrendingUp, MapPin, CheckCircle,
  Loader2, Upload, X, ArrowRight, TriangleAlert, Copy, Printer, FlaskConical,
} from "lucide-react";

const CROPS = ["Maize", "Soybean", "Tobacco", "Groundnut", "Rice"];

const DEMO = {
  crop: "Maize",
  lat: -13.9833,
  lng: 33.7833,
  symptoms: "Yellow leaves on lower stalks with brown patches, stunted growth in the north section of the field.",
};

const AGENTS = [
  { name: "Agronomy Agent",      icon: Sprout,       delay: 0,     key: "agronomy_output", color: "text-green-700", bg: "bg-green-50",   border: "border-green-100" },
  { name: "Climate Agent",       icon: CloudSun,     delay: 4000,  key: "climate_output",  color: "text-sky-600",   bg: "bg-sky-50",     border: "border-sky-100"   },
  { name: "Pest & Disease Agent",icon: Bug,          delay: 9000,  key: "pest_output",     color: "text-red-600",   bg: "bg-red-50",     border: "border-red-100"   },
  { name: "Market Agent",        icon: TrendingUp,   delay: 14000, key: "market_output",   color: "text-amber-600", bg: "bg-amber-50",   border: "border-amber-100" },
  { name: "Decision Review Agent",icon: CheckCircle, delay: 20000, key: "recommendation",  color: "text-primary",   bg: "bg-emerald-50", border: "border-emerald-100"},
];

type AgentStatus = "pending" | "running" | "done";
type ResultData = {
  recommendation: string;
  agronomy_output?: string;
  climate_output?: string;
  pest_output?: string;
  market_output?: string;
};

function useAgentSimulation(active: boolean) {
  const [statuses, setStatuses] = useState<AgentStatus[]>(AGENTS.map(() => "pending"));
  useEffect(() => {
    if (!active) { setStatuses(AGENTS.map(() => "pending")); return; }
    const timers = AGENTS.map((agent, i) =>
      setTimeout(() => {
        setStatuses((prev) => {
          const next = [...prev];
          if (i > 0) next[i - 1] = "done";
          next[i] = "running";
          return next;
        });
      }, agent.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [active]);
  return statuses;
}

export default function AnalyzePage() {
  const [crop, setCrop] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<Record<string, any> | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [validationMsg, setValidationMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const agentStatuses = useAgentSimulation(loading);

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
    const t = setTimeout(() => lookupRegion(lat, lng), 800);
    return () => clearTimeout(t);
  }, [lat, lng, lookupRegion]);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) { setLocError("Geolocation not supported."); return; }
    setLocating(true); setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitude = parseFloat(pos.coords.latitude.toFixed(4));
        const longitude = parseFloat(pos.coords.longitude.toFixed(4));
        setLat(latitude); setLng(longitude); setLocating(false);
        lookupRegion(latitude, longitude);
      },
      () => { setLocError("Could not detect location. Enter coordinates manually."); setLocating(false); }
    );
  }, [lookupRegion]);

  const fillDemo = () => {
    setCrop(DEMO.crop); setLat(DEMO.lat); setLng(DEMO.lng);
    setSymptoms(DEMO.symptoms); setGeoData(null);
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
    setValidationMsg(""); setLoading(true); setError(null); setResultData(null); setImageAnalysis(null);
    try {
      const [recRes, imgRes] = await Promise.allSettled([
        fetch("/api/recommendation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ crop: crop.toLowerCase(), symptoms, latitude: lat, longitude: lng }),
        }),
        image ? (() => {
          const fd = new FormData(); fd.append("file", image);
          return fetch(`/api/analyze-image?crop=${crop.toLowerCase()}`, { method: "POST", body: fd });
        })() : Promise.resolve(null),
      ]);
      if (recRes.status === "fulfilled" && recRes.value.ok) {
        setResultData(await recRes.value.json());
      } else {
        setError("Analysis failed. Make sure the backend is running on port 8000.");
      }
      if (imgRes.status === "fulfilled" && imgRes.value?.ok) {
        setImageAnalysis((await imgRes.value.json()).analysis);
      }
    } catch {
      setError("Could not connect to the backend. Make sure it is running on port 8000.");
    } finally {
      setLoading(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const reset = () => {
    setCrop(""); setLat(null); setLng(null); setSymptoms("");
    setImage(null); setImagePreview(null); setResultData(null);
    setImageAnalysis(null); setError(null); setGeoData(null); setValidationMsg("");
  };

  const copyToClipboard = () => {
    if (!resultData) return;
    navigator.clipboard.writeText(resultData.recommendation);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full bg-surface">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Analyze Your Farm</h1>
            <p className="text-gray-500">Share your details and our agent team will deliver a personalized action plan.</p>
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
                    crop === c ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary"}`}>
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
              <button type="button" onClick={detectLocation} disabled={locating}
                className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                {locating ? "Detecting…" : "Detect My Location"}
              </button>
              {locError && <p className="text-red-500 text-sm flex items-center gap-1"><TriangleAlert className="w-3.5 h-3.5" />{locError}</p>}
              {lat !== null && lng !== null && (
                <div className="space-y-2">
                  <div className="text-sm text-primary font-medium bg-primary/5 px-3 py-2 rounded-lg inline-flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />{lat}, {lng}
                    {geoLoading && <Loader2 className="w-3 h-3 animate-spin ml-1" />}
                  </div>
                  {geoData && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">📍 {geoData.nearest_region?.region}</span>
                      {geoData.soil && <span className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full font-medium">🌱 {geoData.soil.soil_type} · pH {geoData.soil.ph}</span>}
                      {geoData.weather && <span className="text-xs bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full font-medium">🌤 {geoData.weather.season} season · {geoData.weather.avg_temp_c}°C</span>}
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <input type="number" step="any" placeholder="Latitude (e.g. -13.9)" value={lat ?? ""}
                  onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
                <input type="number" step="any" placeholder="Longitude (e.g. 33.7)" value={lng ?? ""}
                  onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : null)}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
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
              Upload a photo <span className="text-gray-400 font-normal">(optional — GPT-4 Vision analysis)</span>
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="Crop preview" className="w-48 h-48 object-cover rounded-xl border border-gray-200" />
                <button type="button" onClick={() => { setImage(null); setImagePreview(null); }}
                  className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow hover:bg-red-50 hover:border-red-200 transition-colors">
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

          {/* Validation */}
          {validationMsg && (
            <p className="text-red-500 text-sm flex items-center gap-2">
              <TriangleAlert className="w-4 h-4" />{validationMsg}
            </p>
          )}

          {/* Submit */}
          <button type="submit" disabled={!crop || lat === null || lng === null || loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Agents are working…</>
              : <><span>Analyze Now</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-sm font-semibold text-foreground mb-5">Your agent team is working…</p>
            <div className="space-y-4">
              {AGENTS.map((agent, i) => {
                const status = agentStatuses[i];
                return (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      status === "done" ? "bg-primary/10" : status === "running" ? "bg-accent/10" : "bg-gray-50"}`}>
                      <agent.icon className={`w-4 h-4 ${status === "done" ? "text-primary" : status === "running" ? "text-accent" : "text-gray-300"}`} />
                    </div>
                    <span className={`text-sm font-medium flex-1 ${status === "done" ? "text-primary" : status === "running" ? "text-foreground" : "text-gray-300"}`}>
                      {agent.name}
                    </span>
                    {status === "done" && <CheckCircle className="w-4 h-4 text-primary" />}
                    {status === "running" && <Loader2 className="w-4 h-4 text-accent animate-spin" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
          {(resultData || imageAnalysis) && (
            <div className="mt-10 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl font-bold text-foreground">Your Action Plan</h2>
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
              </div>

              {/* Vision result */}
              {imageAnalysis && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Bug className="w-4 h-4 text-amber-600" />
                    <h3 className="text-sm font-semibold text-amber-800">Visual Analysis (GPT-4 Vision)</h3>
                  </div>
                  <div className="text-sm text-amber-900 leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown>{imageAnalysis}</ReactMarkdown>
                  </div>
                </div>
              )}

              {/* Agent cards */}
              {resultData && (
                <div className="space-y-4">
                  {AGENTS.slice(0, 4).map((agent) => {
                    const content = resultData[agent.key as keyof ResultData];
                    if (!content) return null;
                    return (
                      <div key={agent.name} className={`${agent.bg} border ${agent.border} rounded-2xl p-6`}>
                        <div className="flex items-center gap-2 mb-3">
                          <agent.icon className={`w-4 h-4 ${agent.color}`} />
                          <h3 className={`text-sm font-semibold ${agent.color}`}>{agent.name}</h3>
                        </div>
                        <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                          <ReactMarkdown>{content}</ReactMarkdown>
                        </div>
                      </div>
                    );
                  })}

                  {/* Final action plan */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-primary">Final Action Plan</h3>
                      <div className="ml-auto flex flex-wrap gap-1.5">
                        {["Agronomy", "Climate", "Pest", "Market"].map((tag) => (
                          <span key={tag} className="text-xs bg-primary/5 text-primary/70 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none">
                      <ReactMarkdown>{resultData.recommendation}</ReactMarkdown>
                    </div>
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
    </div>
  );
}
