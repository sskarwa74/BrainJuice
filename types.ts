
export enum ChatRole {
  USER = 'user',
  AI = 'ai',
}

export interface MapSource {
  uri: string;
  title: string;
}

export interface Message {
  id: string;
  role: ChatRole;
  text: string;
  sources?: MapSource[];
  isLoading?: boolean;
}

export interface GeolocationState {
  latitude: number;
  longitude: number;
}

export interface LatLngLiteral {
  lat: number;
  lng: number;
}

export interface MarkerData {
  position: LatLngLiteral;
  title: string;
}
