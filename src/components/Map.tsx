import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  LayersControl,
  useMap,
} from "react-leaflet";
import { format } from "date-fns";
import type { EarthquakeFeature } from "../types";

interface MapProps {
  data: EarthquakeFeature[];
  selectedPosition: [number, number] | null;
}

const getColor = (mag: number) => {
  if (mag > 6.0) return "#dc2626";
  if (mag > 4.0) return "#f97316";
  if (mag > 2.5) return "#eab308";
  return "#10b981";
};

function FlyToLocation({ coords }: { coords: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 8, {
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
}

export default function Map({ data, selectedPosition }: MapProps) {
  return (
    <MapContainer center={[36.0, -5.0]} zoom={5} scrollWheelZoom={true}>
      <FlyToLocation coords={selectedPosition} />

      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Dark Mode">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Light Mode">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {data.map((eq) => {
        const [lng, lat, depth] = eq.geometry.coordinates;
        return (
          <CircleMarker
            key={eq.id}
            center={[lat, lng]}
            radius={Math.max(eq.properties.mag * 3, 5)}
            pathOptions={{
              color: getColor(eq.properties.mag),
              fillColor: getColor(eq.properties.mag),
              fillOpacity: 0.6,
              weight: 1,
            }}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-lg mb-1">
                  {eq.properties.place}
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="font-semibold">Magnitud:</span>{" "}
                    {eq.properties.mag.toFixed(1)}
                  </p>
                  <p>
                    <span className="font-semibold">Profundidad:</span>{" "}
                    {depth ? depth.toFixed(1) : 0} km
                  </p>
                  <p>
                    <span className="font-semibold">Fecha:</span>{" "}
                    {format(new Date(eq.properties.time), "PPpp")}
                  </p>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
