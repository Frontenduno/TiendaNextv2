// interfaces/location.ts

export interface Location {
  id: number;
  name: string;
  district: string;
  address: string;
  schedule: string;
  phone: string;
  image: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LocationsDataJson {
  districts: string[];
  locations: Location[];
}
