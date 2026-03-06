import { LucideIcon } from "lucide-react";

export interface Game {
  id: number;
  title: string;
  description: string;
  genre: string;
  platform: string;
  rating: number;
  release_date: string;
  banner_url: string;
  thumbnail_url: string;
  trailer_id: string;
  developer: string;
  publisher: string;
  min_requirements: string;
  rec_requirements: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Review {
  id: number;
  game_id: number;
  user_id: number;
  username: string;
  rating: number;
  comment: string;
  created_at: string;
}
