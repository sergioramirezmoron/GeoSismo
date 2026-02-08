import { Globe } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-slate-800 border-b border-slate-700 p-4 shadow-md z-30 relative">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/10 p-2 rounded-full">
            <Globe className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              Geo<span className="text-emerald-500">Sismo</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Datos de La Tierra a tiempo real.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
