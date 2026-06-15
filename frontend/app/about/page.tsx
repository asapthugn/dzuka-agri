import Navbar from "@/components/Navbar";
import { Sprout, Brain, Server, Globe, Zap, Leaf, Users } from "lucide-react";

const STACK = [
  { name: "LangGraph",       desc: "Multi-agent pipeline orchestration",        icon: Brain  },
  { name: "FastAPI",         desc: "High-performance Python backend",            icon: Server },
  { name: "Next.js 15",      desc: "React frontend with App Router",             icon: Globe  },
  { name: "OpenAI GPT-4o",   desc: "Agent reasoning & vision analysis",          icon: Zap    },
  { name: "Open-Meteo",      desc: "Live weather data — no API key needed",      icon: Globe  },
  { name: "Geospatial AI",   desc: "Haversine-based region detection for Malawi",icon: Leaf   },
];

const AGENTS = [
  { name: "Agronomy Agent",       desc: "Crop farming practices & fertilizer recommendations based on soil data." },
  { name: "Climate Agent",        desc: "Live weather analysis & irrigation advice from GPS coordinates." },
  { name: "Pest & Disease Agent", desc: "Diagnoses symptoms and suggests organic & chemical treatments." },
  { name: "Market Agent",         desc: "Real-time crop price analysis and demand outlook per region." },
  { name: "Decision Review Agent",desc: "Synthesizes all expert outputs into one prioritized action plan." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Sprout className="w-3.5 h-3.5 text-accent" />
            Band of Agents Hackathon 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">About Dzuka Agri</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            An AI-powered agricultural intelligence platform built to help smallholder farmers
            in Malawi make smarter, data-driven decisions — powered by a collaborative multi-agent system.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                <strong>Dzuka</strong> means <em>"Rise"</em> in Chichewa — the national language of Malawi.
                Our platform is built to help farmers rise through better information.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By combining 5 specialized AI agents, live weather data, soil analysis,
                market intelligence, and GPS-based geospatial context, Dzuka Agri delivers
                a complete action plan in under 60 seconds.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "5",     label: "AI Agents" },
                { value: "3",     label: "Malawi Regions" },
                { value: "Live",  label: "Weather Data" },
                { value: "< 60s", label: "Analysis Time" },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface rounded-2xl p-6 text-center">
                  <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Agents */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">The Agent Team</h2>
          <p className="text-gray-500 mb-10">Five specialized agents collaborate on every analysis.</p>
          <div className="space-y-4">
            {AGENTS.map((agent, i) => (
              <div key={agent.name} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Tech Stack</h2>
          <p className="text-gray-500 mb-10">Built with modern, production-grade tools.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STACK.map((tech) => (
              <div key={tech.name} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <tech.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{tech.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Our Team</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Built by a passionate team during the <strong>Band of Agents Hackathon 2026</strong> on lablab.ai.
            Our goal — use multi-agent AI to solve real agricultural challenges for farmers in Malawi.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-4 text-center flex items-center justify-center gap-2 text-white/50 text-sm">
          <Sprout className="w-4 h-4 text-accent" />
          <span className="font-medium text-white/70">Dzuka Agri</span>
          <span>Rise to smarter farming.</span>
        </div>
      </footer>
    </div>
  );
}
