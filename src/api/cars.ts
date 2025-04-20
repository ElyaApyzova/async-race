import { ICar } from '../types/interface';

const API_URL = 'http://localhost:3000';

export const getCars = async (
  page: number,
  limit = 7
): Promise<{ cars: ICar[]; total: number }> => {
  const response = await fetch(`${API_URL}/garage?_page=${page}&_limit=${limit}`);
  const total = Number(response.headers.get('X-Total-Count'));
  const cars = await response.json();
  return { cars, total };
};

export const getCar = async (id: number): Promise<ICar> => {
  const response = await fetch(`${API_URL}/garage/${id}`);
  return response.json();
};

export const createCar = async (car: Omit<ICar, 'id'>): Promise<ICar> => {
  const response = await fetch(`${API_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
};

export const updateCar = async (id: number, car: Omit<ICar, 'id'>): Promise<ICar> => {
  const response = await fetch(`${API_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(car),
  });
  return response.json();
};

export const deleteCar = async (id: number): Promise<void> => {
  await fetch(`${API_URL}/garage/${id}`, {
    method: 'DELETE',
  });
};

export const generateRandomCars = async (count = 100): Promise<void> => {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
  const brands = ['Tesla', 'Ford', 'BMW', 'Audi', 'Toyota'];
  const models = ['Model S', 'Mustang', 'i8', 'A4', 'Camry'];

  const cars = Array.from({ length: count }, (_, i) => ({
    name: `${brands[Math.floor(Math.random() * brands.length)]} ${
      models[Math.floor(Math.random() * models.length)]
    }`,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  await Promise.all(cars.map((car) => createCar(car)));
};
