export const startEngine = async (id: number): Promise<{ velocity: number; distance: number }> => {
  try {
    const response = await fetch(`http://localhost:3000/engine?id=${id}&status=started`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error(`Engine start failed for car ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error starting engine for car ${id}:`, error);
    throw error;
  }
};

export const stopEngine = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:3000/engine?id=${id}&status=stopped`, {
      method: 'PATCH'
    });
    if (!response.ok) throw new Error(`Engine stop failed for car ${id}`);
  } catch (error) {
    console.error(`Error stopping engine for car ${id}:`, error);
    throw error;
  }
};

export const driveCar = async (id: number): Promise<boolean> => {
  try {
    const response = await fetch(`http://localhost:3000/engine?id=${id}&status=drive`, {
      method: 'PATCH'
    });
    return response.ok;
  } catch (error) {
    console.error(`Error driving car ${id}:`, error);
    return false;
  }
};