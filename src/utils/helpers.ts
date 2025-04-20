export const generateRandomColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };
  
  export const generateRandomName = (): string => {
    const brands = [
      'Tesla', 'Ford', 'BMW', 'Mercedes', 'Audi', 
      'Toyota', 'Honda', 'Chevrolet', 'Volkswagen', 'Porsche'
    ];
    const models = [
      'Model S', 'Mustang', 'i8', 'C-Class', 'A4',
      'Camry', 'Civic', 'Corvette', 'Golf', '911'
    ];
    return `${brands[Math.floor(Math.random() * brands.length)]} ${
      models[Math.floor(Math.random() * models.length)]
    }`;
  };