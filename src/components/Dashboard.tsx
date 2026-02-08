import { useState, useEffect } from "react";
import {
  Activity,
  AlertTriangle,
  Navigation,
  Map as MapIcon,
} from "lucide-react";
import type { EarthquakeStats } from "../types";

interface DashboardProps {
  stats: EarthquakeStats;
  onLocationSelect: (coords: [number, number]) => void;
}

const fetchCityName = async (lat: number, lng: number, fallback: string) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
    );
    const data = await res.json();

    const address = data.address;
    if (!address) return fallback;

    const exactPlace =
      address.city ||
      address.town ||
      address.village ||
      address.municipality ||
      address.county;

    return exactPlace ? `${exactPlace}, ${address.country || ""}` : fallback;
  } catch (e) {
    console.error(e);
    return fallback;
  }
};

export default function Dashboard({ stats, onLocationSelect }: DashboardProps) {
  const [nearestPlace, setNearestPlace] = useState<string>("");
  const [strongestPlace, setStrongestPlace] = useState<string>("");

  const nearestId = stats.nearest.feature?.id;
  const nearestCoords = stats.nearest.feature?.geometry.coordinates;
  const nearestLat = nearestCoords ? nearestCoords[1] : 0;
  const nearestLng = nearestCoords ? nearestCoords[0] : 0;
  const nearestFallback = stats.nearest.feature?.properties.place || "";
  const nearestMag = stats.nearest.feature?.properties.mag || 0;

  const strongestId = stats.strongest?.id;
  const strongestCoords = stats.strongest?.geometry.coordinates;
  const strongestLat = strongestCoords ? strongestCoords[1] : 0;
  const strongestLng = strongestCoords ? strongestCoords[0] : 0;
  const strongestFallback = stats.strongest?.properties.place || "";
  const strongestMag = stats.strongest?.properties.mag || 0;

  useEffect(() => {
    if (!nearestId) return;

    let isMounted = true;

    fetchCityName(nearestLat, nearestLng, nearestFallback).then((name) => {
      if (isMounted) setNearestPlace(name);
    });

    return () => {
      isMounted = false;
    };
  }, [nearestId, nearestLat, nearestLng, nearestFallback]);

  useEffect(() => {
    if (!strongestId) return;

    let isMounted = true;

    fetchCityName(strongestLat, strongestLng, strongestFallback).then(
      (name) => {
        if (isMounted) setStrongestPlace(name);
      },
    );

    return () => {
      isMounted = false;
    };
  }, [strongestId, strongestLat, strongestLng, strongestFallback]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 z-10 relative">
      <div className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 flex items-center">
        <div className="p-3 bg-blue-500/20 rounded-full mr-4">
          <Activity className="text-blue-400 w-6 h-6" />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Total 7 días</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
      </div>

      <div
        className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 flex items-center cursor-pointer hover:bg-slate-750 hover:border-red-500/50 transition-all group"
        onClick={() =>
          stats.strongest && onLocationSelect([strongestLat, strongestLng])
        }
      >
        <div className="p-3 bg-red-500/20 rounded-full mr-4 group-hover:bg-red-500/30 transition-colors">
          <AlertTriangle className="text-red-400 w-6 h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-slate-400 text-sm">Más Fuerte</p>
          {stats.strongest ? (
            <div>
              <p className="text-2xl font-bold text-white">
                {strongestMag.toFixed(1)}
              </p>
              <p
                className="text-xs text-slate-400 truncate"
                title={strongestPlace || strongestFallback}
              >
                {strongestPlace || strongestFallback}
              </p>
            </div>
          ) : (
            <p className="text-white">-</p>
          )}
        </div>
      </div>

      <div
        className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 flex items-center col-span-1 md:col-span-2 cursor-pointer hover:bg-slate-750 hover:border-emerald-500/50 transition-all group"
        onClick={() =>
          stats.nearest.feature && onLocationSelect([nearestLat, nearestLng])
        }
      >
        <div className="p-3 bg-emerald-500/20 rounded-full mr-4 group-hover:bg-emerald-500/30 transition-colors">
          <Navigation className="text-emerald-400 w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-400 text-sm">Más cercano</p>
          {stats.nearest.feature ? (
            <div className="truncate">
              <p
                className="text-lg font-bold text-white truncate"
                title={nearestPlace || nearestFallback}
              >
                {nearestPlace || nearestFallback}
              </p>

              <div className="flex items-center text-xs text-slate-400 space-x-2 mt-1">
                <span className="bg-slate-700 px-1.5 py-0.5 rounded text-white">
                  {stats.nearest.distance?.toFixed(0)} km
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded font-bold text-black ${
                    nearestMag > 5
                      ? "bg-red-500"
                      : nearestMag > 3
                        ? "bg-orange-500"
                        : "bg-emerald-500"
                  }`}
                >
                  {nearestMag.toFixed(1)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center text-yellow-500 text-sm">
              <MapIcon className="w-4 h-4 mr-2" />
              <span>Activa la ubicación para ver el más cercano.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
