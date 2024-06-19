/* eslint-disable @typescript-eslint/naming-convention */

declare type RateValue = 1 | 2 | 3 | 4 | 5 | number;

declare interface ApiResponse {
  status: boolean;
  code: number | string;
  message: string;
  data: any;
}

declare interface Settings {
  theme: 'dark' | 'light';
  notifications: boolean;
}

declare interface Professional {
  id: number;
  name: string;
  photoUrl: string;
  job: string;
  location: string;
  description?: string;
  coverUrl?: string;
  rate?: RateValue;
  likes?: number;
  liked?: boolean;
  services?: string[];
  price?:string;
  coords?: { lat: number; lng: number; alt?: number };
}

declare interface IntroPayload {
  version: string;
  date: string;
}

declare interface ReviewItem {
  rate: RateValue;
  message?: string;
  name?: string;
  photoUrl?: string;
  created?: string;
}

declare interface User {
  id: number;
  created_at: string;
  updated_at?: string;
  name: string;
  email: string;
  email_verified: boolean;
  phone: string;
  phone_verified: boolean;
  gender?: Gender;
  photo_url: string;
  cover_url: string;
  city: AppLocation;
  town: AppLocation;
  provider?: string;
  provider_id?: null;
  id_token?: string;
  professional?: ProfessionalData;
}

declare interface ProfessionalData {
  job_id: number;
  address: string;
  company_name: string;
  description: string;
  geolocation: any;
  services: string[];
  products: string[];
}

declare interface AppLocation {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
}

declare type Gender = 'male' | 'female';

declare type PageState = 'initial' | 'loading' | 'ready' | 'failed' | 'offline';
