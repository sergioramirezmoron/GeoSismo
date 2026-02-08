import type { EMSCRawFeature, USGSResponse } from "../types";

export const fetchEarthquakeData = async (): Promise<USGSResponse> => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const dateStr = sevenDaysAgo.toISOString().split("T")[0];
  const API_URL = `${import.meta.env.VITE_API_URL}${dateStr}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const adaptedFeatures = data.features.map((feature: EMSCRawFeature) => ({
      type: feature.type,
      id: feature.id,
      geometry: feature.geometry,
      properties: {
        mag: feature.properties.mag,
        place:
          feature.properties.flynn_region ||
          feature.properties.region ||
          "Unknown Location",
        time: new Date(feature.properties.time).getTime(),
        url: feature.properties.url || "#",
        title: `M ${feature.properties.mag} - ${feature.properties.flynn_region}`,
        updated: Date.now(),
        tz: null,
        detail: "",
        status: "reviewed",
        tsunami: 0,
        sig: 0,
        net: "emsc",
        code: feature.id,
        ids: feature.id,
        sources: "emsc",
        types: "earthquake",
        nst: null,
        dmin: null,
        rms: null,
        gap: null,
        magType: feature.properties.magtype,
        type: "earthquake",
      },
    }));

    return {
      ...data,
      features: adaptedFeatures,
    };
  } catch (error) {
    console.error("Error fetching earthquakes:", error);
    throw error;
  }
};