// src/utils/constants.ts
import { CAR_STATUS } from '../constants/constant';

export interface ICar {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
  color?: string;
  name?: string;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export type SortField = 'id' | 'wins' | 'time';
export type SortOrder = 'asc' | 'desc';


export type CarStatus = keyof typeof CAR_STATUS;