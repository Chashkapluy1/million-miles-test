export default function Footer() {
  return (
    <footer className="border-t border-dark-border bg-dark-card mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 gold-gradient rounded-sm flex items-center justify-center">
                <span className="text-dark font-black text-xs">M</span>
              </div>
              <span className="font-bold tracking-wider">
                MILLION<span className="gold-text">MILES</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              International premium vehicle sourcing and delivery since 2009.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-3">
              Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              {["Car Search", "Import & Delivery", "Customs Clearance", "Financing"].map((s) => (
                <li key={s}>
                  <a href="#" className="hover:text-gold transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm text-white uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>
                <a href="mailto:info@millionmiles.ae" className="hover:text-gold transition-colors">
                  info@millionmiles.ae
                </a>
              </li>
              <li className="text-gray-500">Available 24/7</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-dark-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Million Miles. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs">
            Car data sourced from{" "}
            <a
              href="https://www.encar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              encar.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
