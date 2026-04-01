import { Shield, Globe, Zap } from "lucide-react";

const stats = [
  { value: "10 000+", label: "Happy Clients", icon: Shield },
  { value: "15 Years", label: "On the Market", icon: Globe },
  { value: "2 Weeks", label: "Avg. Delivery", icon: Zap },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/50 to-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
        <div className="max-w-2xl animate-slide-up">
          <p className="text-gold font-semibold text-sm tracking-[0.2em] uppercase mb-4">
            International Premium Service
          </p>
          <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-6">
            Find Your Perfect
            <br />
            <span className="gold-text">Car Worldwide</span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
            We source and deliver premium vehicles from Korea&apos;s largest
            marketplace directly to your door — anywhere in the world.
          </p>
          <a
            href="#catalog"
            className="inline-flex items-center gap-2 gold-gradient text-dark font-bold px-8 py-4 rounded text-base hover:opacity-90 transition-all hover:scale-105"
          >
            Browse Catalog
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 border-t border-dark-border bg-dark/90 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-dark-border">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-5 px-4"
              >
                <Icon size={20} className="text-gold shrink-0" />
                <div className="text-center sm:text-left">
                  <p className="font-bold text-lg sm:text-xl text-white">
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 tracking-wide">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
