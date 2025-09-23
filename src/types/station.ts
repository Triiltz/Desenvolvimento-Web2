export interface FuelData {
  price: number;
  updated: string;
}

export interface Station {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  features: string[];
  fuels: {
    gasoline?: FuelData;
    ethanol?: FuelData;
    diesel?: FuelData;
    [k: string]: FuelData | undefined;
  };
  createdAt: string;
  updatedAt: string;
  distanceMeters?: number;
}

export interface StationListResponse {
  page: number;
  limit: number;
  count: number;
  data: Station[];
}
