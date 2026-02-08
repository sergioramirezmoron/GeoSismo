export interface EarthquakeFeature {
  type: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    title: string;
    updated: number;
    tz: number | null;
    detail: string;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number | null;
    gap: number | null;
    magType: string;
    type: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
  id: string;
}

export interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface EMSCRawFeature {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: [number, number, number];
  };
  properties: {
    mag: number;
    flynn_region?: string;
    region?: string;
    time: string;
    url?: string;
    magtype: string;
  };
}

export interface EarthquakeStats {
  total: number;
  strongest: EarthquakeFeature | null;
  nearest: {
    feature: EarthquakeFeature | null;
    distance: number | null;
  };
}
