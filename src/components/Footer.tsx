import { Coffee, Heart } from "lucide-react";

export default function Footer() {
  const DONATION_URL = "https://www.buymeacoffee.com/sergioramor";

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-auto z-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col md:flex-row items-center gap-2 text-xs text-slate-500 order-3 md:order-1">
          <span className="whitespace-nowrap">&copy; {new Date().getFullYear()} Monitor de Terremotos</span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="flex items-center">
            Construido con <Heart className="w-3 h-3 text-red-500 mx-1 fill-red-500/20" /> por
            <span className="text-emerald-400 ml-1 font-medium tracking-wide">
              Sergio Ramírez Morón
            </span>
          </span>
        </div>

        <nav className="flex flex-wrap justify-center gap-6 text-xs font-medium text-slate-400 order-2">
          <a
            href="https://www.seismicportal.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors duration-200"
          >
            Datos: EMSC
          </a>
          <a
            href="https://www.openstreetmap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors duration-200"
          >
            Mapas: OpenStreetMap
          </a>
          <a
            href="https://leafletjs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors duration-200"
          >
            Lib: Leaflet
          </a>
        </nav>

        <a
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group order-1 md:order-3 flex items-center space-x-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/20 active:scale-95 text-xs"
        >
          <Coffee className="w-4 h-4 transition-transform group-hover:-rotate-12" />
          <span>Donar</span>
        </a>

      </div>
    </footer>
  );
}