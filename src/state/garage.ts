//import { getCars, createCar, updateCar, deleteCar, generateRandomCars, getCar } from '../api/cars';
import { carService } from '@api/index';
import { ICar } from '../types/interface';

export class GarageState {
  private _cars: ICar[] = [];
  private _totalCount = 0;
  private _page = 1;
  private _selectedCar: ICar | null = null;

  async loadCars(): Promise<void> {
    const { cars, total } = await carService.getCars(this._page);
    this._cars = cars;
    this._totalCount = total;
  }

  async addCar(car: Omit<ICar, 'id'>): Promise<void> {
    await carService.createCar(car);
    this._totalCount += 1;
    await this.loadCars();
  }

  async updateCar(id: number, car: Omit<ICar, 'id'>): Promise<void> {
    await carService.updateCar(id, car);
    await this.loadCars();
  }

  async deleteCar(id: number): Promise<void> {
    await carService.deleteCar(id);
    this._totalCount = Math.max(0, this._totalCount - 1);
    await this.loadCars();
  }

  async generateRandomCars(count = 100): Promise<void> {
    await carService.generateRandomCars(count);
    await this.loadCars();
  }

  async selectCar(id: number): Promise<void> {
    this._selectedCar = await carService.getCar(id);
  }

  get cars(): ICar[] {
    return this._cars;
  }
  get totalCount(): number {
    return this._totalCount;
  }
  get page(): number {
    return this._page;
  }
  get selectedCar(): ICar | null {
    return this._selectedCar;
  }

  set page(newPage: number) {
    this._page = newPage;
  }
}

export const garageState = new GarageState();
