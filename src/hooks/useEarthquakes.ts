import { useState, useEffect, useMemo } from "react";
import { fetchEarthquakeData } from "../services/usgsApi";
import { calculateDistance } from "../utils/geo";
import type { EarthquakeFeature, EarthquakeStats } from "../types";

export const useEarthquakes = () => {
  const [data, setData] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => console.warn("Geolocation access denied"),
      );
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetchEarthquakeData();
        setData(response.features);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const intervalId = setInterval(loadData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  const stats = useMemo<EarthquakeStats>(() => {
    if (!data.length) {
      return {
        total: 0,
        strongest: null,
        nearest: { feature: null, distance: null },
      };
    }

    const strongestFeature = data.reduce((prev, current) =>
      prev.properties.mag > current.properties.mag ? prev : current,
    );

    let nearestFeature: EarthquakeFeature | null = null;
    let minDistance = Infinity;

    if (userLocation) {
      data.forEach((eq) => {
        const [lng, lat] = eq.geometry.coordinates;
        const dist = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          lat,
          lng,
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearestFeature = eq;
        }
      });
    }

    return {
      total: data.length,
      strongest: strongestFeature,
      nearest: {
        feature: nearestFeature,
        distance: userLocation ? minDistance : null,
      },
    };
  }, [data, userLocation]);

  return { earthquakes: data, loading, error, stats, userLocation };
};
