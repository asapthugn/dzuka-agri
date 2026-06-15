import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Sprout,
  Bug,
  CloudSun,
  TrendingUp,
  MapPin,
  CheckCircle,
  ArrowRight,
  Locate,
  BarChart3,
} from "lucide-react";

const AGENTS = [
  {
    icon: Sprout,
    name: "Agronomy Agent",
    color: "text-green-700",
    bg: "bg-green-50",
    desc: "Recommends best farming practices, soil management, and crop-specific guidance based on your land.",
  },
  {
    icon: Bug,
    name: "Pest & Disease Agent",
    color: "text-red-600",
    bg: "bg-red-50",
    desc: "Identifies threats from your described symptoms or uploaded images and suggests organic and chemical treatments.",
  },
  {
    icon: MapPin,
    name: "GPS & Geospatial Agent",
    color: "text-blue-600",
    bg: "bg-blue-50",
    desc: "Uses your GPS coordinates to provide region-specific context and localized risk assessments.",
  },
  {
    icon: CloudSun,
    name: "Environmental Agent",
    color: "text-sky-600",
    bg: "bg-sky-50",
    desc: "Interprets live weather data including temperature, rainfall, and humidity to improve planting and irrigation decisions.",
  },
  {
    icon: TrendingUp,
    name: "Market Intelligence Agent",
    color: "text-amber-600",
    bg: "bg-amber-50",
    desc: "Provides current crop prices, demand trends, and regional selling opportunities to maximize your yield value.",
  },
  {
    icon: CheckCircle,
    name: "Decision Review Agent",
    color: "text-primary",
    bg: "bg-emerald-50",
    desc: "Synthesizes all agent insights into one trusted, prioritized action plan you can act on immediately.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Share your farm details",
    desc: "Tell us your crop, location, and what you're observing. Upload a photo if you have one.",
    icon: Locate,
  },
  {
    num: "02",
    title: "Agents collaborate",
    desc: "Six specialized AI agents analyze your situation simultaneously: agronomy, climate, pests, markets, and more.",
    icon: BarChart3,
  },
  {
    num: "03",
    title: "Get your action plan",
    desc: "A Decision Review Agent synthesizes all insights into one clear, prioritized recommendation.",
    icon: CheckCircle,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #236b45 0%, transparent 50%)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
              Powered by multi-agent AI collaboration
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Intelligence <br />
              <span className="text-accent">in the field.</span>
            </h1>
            <p className="text-lg text-white/75 max-w-xl mb-10 leading-relaxed">
              Six specialized AI agents work together to analyze your crops,
              location, weather, pests, and market, delivering one trusted
              action plan for your farm.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-3 rounded-full transition-colors"
              >
                Analyze My Farm
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>

        {/* Floating agent badges */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 opacity-70">
          {["Agronomy", "Pest & Disease", "Climate", "Market", "Review"].map(
            (label) => (
              <div
                key={label}
                className="bg-white/10 text-white text-sm px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20"
              >
                {label}
              </div>
            )
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: "5",     label: "AI Agents" },
              { value: "3",     label: "Malawi Regions" },
              { value: "Live",  label: "Weather Data" },
              { value: "< 60s", label: "Analysis Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-primary mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              From farm problem to action plan in under 60 seconds.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-5xl font-black text-primary mb-3">{step.num}</div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agent Cards */}
      <section id="agents" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-3">Your AI Expert Team</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Each agent specializes in one domain. Together, they cover everything your farm needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {AGENTS.map((agent) => (
              <div
                key={agent.name}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-200 bg-white"
              >
                <div className={`w-11 h-11 rounded-xl ${agent.bg} flex items-center justify-center mb-4`}>
                  <agent.icon className={`w-5 h-5 ${agent.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{agent.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to grow smarter?
          </h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Share your farm details and let our agents deliver your personalized action plan.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-8 py-3.5 rounded-full transition-colors"
          >
            Start Your Analysis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-dark py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-2 text-white/50 text-sm">
          <Sprout className="w-4 h-4 text-accent" />
          <span className="font-medium text-white/70">Dzuka Agri</span>
          <span>Rise to smarter farming.</span>
        </div>
      </footer>
    </div>
  );
}
