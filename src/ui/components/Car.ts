// src/ui/components/Car.ts
import { garageState } from '../../state/garage';
import { startEngine, stopEngine, driveCar } from '../../api/engine';
import { Modal } from './Modal';
import { ICar, EngineResponse } from '../../types/interface';
import { winnersState } from '../../state/winner';

type CarStatus = 'stopped' | 'started' | 'driving' | 'broken';

export class Car {
  public readonly id: number;
  public readonly name: string;
  private element: HTMLElement;
  private car: ICar;
  private animationId: number | null = null;
  private position = 0;
  private modal: Modal;
  private status: CarStatus = 'stopped';
  private startTime = 0;
  private finishTime = 0;

  constructor(car: ICar) {
    this.id = car.id;
    this.name = car.name;
    this.car = car;
    this.element = document.createElement('div');
    this.element.className = 'car';
    this.element.dataset.id = car.id.toString();
    this.modal = new Modal();
    this.render();
  }

  private render(): void {
    this.element.innerHTML = `
      <div class="car-controls">
        <button class="btn select-btn">Select</button>
        <button class="btn remove-btn">Remove</button>
        <button class="btn start-btn">Start</button>
        <button class="btn stop-btn" disabled>Stop</button>
        <span class="car-name">${this.name}</span>
      </div>
      <div class="car-track">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" 
             class="car-icon" style="color:${this.car.color}">
          <path d="M5,12 L55,12 C57,12 58,13 58,15 L58,20 C58,22 57,23 55,23 L5,23 C3,23 2,22 2,20 L2,15 C2,13 3,12 5,12 Z" 
                fill="currentColor" stroke="#333" stroke-width="0.5"/>
          <path d="M10,13 L20,13 L20,20 L10,20 Z" fill="#aad4f5" stroke="#333" stroke-width="0.3"/>
          <path d="M40,13 L50,13 L50,20 L40,20 Z" fill="#aad4f5" stroke="#333" stroke-width="0.3"/>
          <circle cx="15" cy="23" r="4" fill="#222" stroke="#111" stroke-width="0.5"/>
          <circle cx="45" cy="23" r="4" fill="#222" stroke="#111" stroke-width="0.5"/>
          <path d="M15,15 L45,15 L45,17 L15,17 Z" fill="#fff" opacity="0.8"/>
        </svg>
        <div class="finish-line"></div>
      </div>
    `;
    this.addEventListeners();
  }

  private addEventListeners(): void {
    const startBtn = this.element.querySelector('.start-btn');
    const stopBtn = this.element.querySelector('.stop-btn');
    const selectBtn = this.element.querySelector('.select-btn');
    const removeBtn = this.element.querySelector('.remove-btn');

    startBtn?.addEventListener('click', () => this.startRace());
    stopBtn?.addEventListener('click', () => this.stopEngine());
    selectBtn?.addEventListener('click', () => {
      garageState.selectCar(this.id);
      
      const garageView = document.querySelector('.garage-view');
      if (garageView) {
        const nameInput = garageView.querySelector('.car-name-input') as HTMLInputElement;
        const colorInput = garageView.querySelector('.car-color-input') as HTMLInputElement;
        const updateBtn = garageView.querySelector('.update-btn') as HTMLButtonElement;
        
        nameInput.value = this.name;
        colorInput.value = this.car.color;
        updateBtn.disabled = false;
      }
    });
    removeBtn?.addEventListener('click', async () => {
      try {
        await garageState.deleteCar(this.id);
      } catch (error) {
        console.error('Failed to delete car:', error);
      }
    });
  }

  private toggleButtons(isRunning: boolean): void {
    const startBtn = this.element.querySelector('.start-btn') as HTMLButtonElement;
    const stopBtn = this.element.querySelector('.stop-btn') as HTMLButtonElement;

    if (startBtn && stopBtn) {
      startBtn.disabled = isRunning;
      stopBtn.disabled = !isRunning;
    }
  }

  private stopAnimation(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private resetCarPosition(): void {
    this.position = 0;
    this.updateCarPosition();
  }

  private updateCarPosition(): void {
    const carIcon = this.element.querySelector('.car-icon') as HTMLElement;
    if (carIcon) {
      carIcon.style.transform = `translateX(${this.position}px)`;
    }
  }

  public async startRace(): Promise<number | null> {
    if (this.status !== 'stopped') return null;

    try {
      // 1. Start engine and get performance data
      const { velocity, distance } = await startEngine(this.id);
      this.status = 'started';
      this.startTime = performance.now();

      // 2. Calculate animation duration (ms)
      const duration = distance / velocity;

      // 3. Start animation
      this.startAnimation(duration);

      // 4. Start driving and wait for result
      const success = await driveCar(this.id);
      this.finishTime = performance.now();

      if (!success) {
        this.status = 'broken';
        this.stopAnimation();
        return null;
      }

      this.status = 'finished';
      return this.finishTime - this.startTime;
    } catch (error) {
      this.status = 'broken';
      this.stopAnimation();
      console.error(`Car ${this.id} race failed:`, error);
      return null;
    }
  }

  private startAnimation(duration: number): void {
    this.stopAnimation();
    const startTime = performance.now();
    const track = this.element.querySelector('.car-track');
    if (!track) return;

    const trackWidth = track.clientWidth;
    const finishPosition = trackWidth - 50; // 50px = car width

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      this.position = progress * finishPosition;
      this.updateCarPosition();

      if (progress < 1 && this.status !== 'broken') {
        this.animationId = requestAnimationFrame(animate);
      }
    };

    this.animationId = requestAnimationFrame(animate);
  }

  public async resetCar(): Promise<void> {
    try {
      await stopEngine(this.id);
      this.stopAnimation();
      this.resetCarPosition();
      this.status = 'stopped';
    } catch (error) {
      console.error(`Error resetting car ${this.id}:`, error);
    }
  }
  public showWinner(time: number): void {
    const raceTime = ((this.finishTime - this.startTime) / 1000).toFixed(2);
    this.modal.show(`Winner: ${this.name} (${raceTime}s)`);
  }

  public async resetCar(): Promise<void> {
    await this.stopEngine();
    this.resetCarPosition();
  }

  private async stopEngine(): Promise<void> {
    if (this.status === 'stopped') return;

    try {
      await stopEngine(this.id);
      this.stopAnimation();
      this.resetCarPosition();
      this.toggleButtons(false);
      this.status = 'stopped';
    } catch (error) {
      console.error('Engine stop failed:', error);
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
