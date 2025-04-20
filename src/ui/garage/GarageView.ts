import { garageState } from '../../state/garage';
import { Car } from '../components/Car';
import { Pagination, IPaginationOptions } from '../components/Pagination';
import { RaceController } from '../../RaceController';

export class GarageView {
  private raceController: RaceController;
  private element: HTMLElement;
  private pagination: Pagination;
  private cars: Car[] = [];

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'garage-view';
    this.raceController = new RaceController(this.cars);
    
    const paginationOptions: IPaginationOptions = {
      itemsPerPage: 7,
      currentPage: garageState.page,
      totalItems: garageState.totalCount,
      onPageChange: (page: number) => this.handlePageChange(page)
    };
    
    this.pagination = new Pagination(paginationOptions);
    this.render();
  }

  private async handlePageChange(page: number): Promise<void> {
    garageState.page = page;
    await garageState.loadCars();
    this.updatePagination();
    this.renderCars();
  }

  private updatePagination(): void {
    this.pagination.update({
      currentPage: garageState.page,
      totalItems: garageState.totalCount
    });
  }

  async render(): Promise<void> {
    await garageState.loadCars();
    
    this.element.innerHTML = `
      <h2>Garage (${garageState.totalCount})</h2>
      <div class="garage-controls">
        <button class="btn race-btn">Race</button>
        <button class="btn reset-btn" disabled>Reset</button>
        <button class="btn generate-btn">Generate Cars</button>
      </div>
      <div class="create-car">
        <input type="text" class="car-name-input" placeholder="Car name">
        <input type="color" class="car-color-input" value="#ffffff">
        <button class="btn create-btn">Create</button>
        <button class="btn update-btn" disabled>Update</button>
      </div>
      <div class="cars-container"></div>
    `;

    this.element.appendChild(this.pagination.getElement());
    this.renderCars();
    this.addEventListeners();
  }

  private renderCars(): void {
    const container = this.element.querySelector('.cars-container');
    if (!container) return;
    
    container.innerHTML = '';
    this.cars = garageState.cars.map(car => new Car(car));
    this.cars.forEach(car => container.appendChild(car.getElement()));
  }

  private addEventListeners(): void {
    this.element.querySelector('.race-btn')?.addEventListener('click', async () => {
      const raceBtn = this.element.querySelector('.race-btn') as HTMLButtonElement;
      const resetBtn = this.element.querySelector('.reset-btn') as HTMLButtonElement;
      
      raceBtn.disabled = true;
      await this.raceController.startRace();
      resetBtn.disabled = false;
    });

    this.element.querySelector('.reset-btn')?.addEventListener('click', async () => {
      const raceBtn = this.element.querySelector('.race-btn') as HTMLButtonElement;
      const resetBtn = this.element.querySelector('.reset-btn') as HTMLButtonElement;
      
      resetBtn.disabled = true;
      await this.raceController.resetRace();
      raceBtn.disabled = false;
    });

    this.element.querySelector('.generate-btn')?.addEventListener('click', async () => {
      await garageState.generateRandomCars(100);
      this.renderCars();
      this.updatePagination();
    });

    this.element.querySelector('.create-btn')?.addEventListener('click', async () => {
      const nameInput = this.element.querySelector('.car-name-input') as HTMLInputElement;
      const colorInput = this.element.querySelector('.car-color-input') as HTMLInputElement;
      
      if (nameInput.value.trim()) {
        await garageState.addCar({
          name: nameInput.value.trim(),
          color: colorInput.value
        });
        nameInput.value = '';
        this.renderCars();
        this.updatePagination();
      }
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
 