// interfaces/locations.ts

export interface Ubicacion {
  id: number;
  alias: string;
  direccion: string;
  distrito: string;
  ciudad: string;
  referencia: string;
  nombreContacto: string;
  telefono: string;
  esPrincipal: boolean;
}

export interface LocationsData {
  ubicaciones: Ubicacion[];
}