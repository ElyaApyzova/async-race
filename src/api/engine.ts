export const startEngine = async (id: number): Promise<{ velocity: number; distance: number }> => {
  const response = await fetch(`http://localhost:3000/engine?id=${id}&status=started`, {
    method: 'PATCH'
  });
  return response.json();
};

export const stopEngine = async (id: number): Promise<void> => {
  await fetch(`http://localhost:3000/engine?id=${id}&status=stopped`, {
    method: 'PATCH'
  });
};

export const driveCar = async (id: number): Promise<boolean> => {
  const response = await fetch(`http://localhost:3000/engine?id=${id}&status=drive`, {
    method: 'PATCH'
  });
  return response.ok;
};