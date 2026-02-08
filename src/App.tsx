import { useState } from "react";
import { useEarthquakes } from "./hooks/useEarthquakes";
import Map from "./components/Map";
import Dashboard from "./components/Dashboard";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const { earthquakes, loading, error, stats } = useEarthquakes();
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  if (loading && !earthquakes.length) {
    return (
      <div className="h-dvh w-screen bg-slate-900 flex items-center justify-center flex-col gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
        <p className="text-emerald-500 font-mono animate-pulse">
          Detectando actividad sísmica...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-dvh w-screen bg-slate-900 flex items-center justify-center text-red-500 flex-col gap-2">
        <p className="text-2xl font-bold">Error de conexión</p>
        <p className="text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-dvh w-full bg-slate-900 text-white overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col p-4 relative overflow-y-auto md:overflow-hidden">
        <div className="container mx-auto md:h-full flex flex-col gap-4">
          <div className="shrink-0">
            <Dashboard
              stats={stats}
              onLocationSelect={(coords) => setMapCenter(coords)}
            />
          </div>
          <div className="min-h-125 h-[50vh] md:h-auto md:min-h-0 md:flex-1 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative z-0">
            <Map data={earthquakes} selectedPosition={mapCenter} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
