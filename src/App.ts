import { garageState } from './state/garage';
import { Car } from './ui/components/Car';

class App {
  private carElements: HTMLElement;

  constructor() {
    this.carElements = document.createElement('div');
    this.carElements.className = 'car-list';
    this.init();
  }

  private async init() {
    await garageState.loadCars();
    this.renderCars();
    document.getElementById('app')?.appendChild(this.carElements);
  }

  private renderCars() {
    this.carElements.innerHTML = '';
    garageState.cars.forEach(car => {
      const carComponent = new Car(car);
      this.carElements.appendChild(carComponent.getElement());
    });
  }
}

new App();