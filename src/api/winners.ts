// src/api/winners.ts
import { Winner } from '../types/interface';

const API_URL = 'http://localhost:3000';

export const getWinners = async (
  page: number,
  limit = 10,
  sort?: 'id' | 'wins' | 'time',
  order?: 'asc' | 'desc'
): Promise<{ winners: Winner[]; total: number }> => {
  let url = `${API_URL}/winners?_page=${page}&_limit=${limit}`;
  if (sort) url += `&_sort=${sort}`;
  if (order) url += `&_order=${order}`;

  const response = await fetch(url);
  const total = Number(response.headers.get('X-Total-Count'));
  const winners = await response.json();
  return { winners, total };
};

export const getWinner = async (id: number): Promise<Winner> => {
  const response = await fetch(`${API_URL}/winners/${id}`);
  return response.json();
};

export const createWinner = async (winner: Omit<Winner, 'id'>): Promise<Winner> => {
  const response = await fetch(`${API_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
};

export const updateWinner = async (id: number, winner: Omit<Winner, 'id'>): Promise<Winner> => {
  const response = await fetch(`${API_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return response.json();
};

export const deleteWinner = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/winners/${id}`, {
    method: 'DELETE',
  });
};
