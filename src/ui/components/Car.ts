// src/ui/components/Car.ts
import { garageState } from '../../state/garage';
import { startEngine, stopEngine, driveCar } from '../../api/engine';
import { Modal } from './Modal';
import { ICar, EngineResponse } from '../../types/interface';

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
        <div class="car-icon" style="color: ${this.car.color}">
          🚗
        </div>
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
    selectBtn?.addEventListener('click', () => garageState.selectCar(this.id));
    removeBtn?.addEventListener('click', () => garageState.deleteCar(this.id));
  }

  private toggleButtons(isRunning: boolean): void {
    const startBtn = this.element.querySelector('.start-btn') as HTMLButtonElement;
    const stopBtn = this.element.querySelector('.stop-btn') as HTMLButtonElement;

    if (startBtn && stopBtn) {
      startBtn.disabled = isRunning;
      stopBtn.disabled = !isRunning;
    }
  }

  private animateCar(duration: number): void {
    this.stopAnimation();
    const startTime = performance.now();
    const track = this.element.querySelector('.car-track');
    if (!track) return;

    const trackWidth = track.clientWidth;
    const finishPosition = trackWidth - 50;

    const animateFrame = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      this.position = progress * finishPosition;
      this.updateCarPosition();

      if (progress < 1) {
        this.animationId = requestAnimationFrame(animateFrame);
      }
    };

    this.animationId = requestAnimationFrame(animateFrame);
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

    const startBtn = this.element.querySelector('.start-btn') as HTMLButtonElement;
    const stopBtn = this.element.querySelector('.stop-btn') as HTMLButtonElement;

    if (!startBtn || !stopBtn) return null;

    startBtn.disabled = true;
    this.status = 'started';
    this.startTime = performance.now();

    try {
      const { velocity, distance } = await startEngine(this.id);
      stopBtn.disabled = false;
      this.status = 'driving';

      const duration = distance / velocity;
      this.animateCar(duration);

      const success = await driveCar(this.id);
      this.finishTime = performance.now();

      if (!success) {
        this.status = 'broken';
        await this.stopEngine();
        return null;
      }

      this.status = 'stopped';
      return duration;
    } catch (error) {
      this.status = 'broken';
      console.error('Engine start failed:', error);
      await this.stopEngine();
      return null;
    }
  }

  public showWinner(time: number): void {
    const raceTime = ((this.finishTime - this.startTime) / 1000).toFixed(2);
    this.modal.show(`Winner: ${this.name} (${raceTime}s)`);
  }

  public async resetCar(): Promise<void> {
    await this.stopEngine();
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

  public getElement(): HTMLElement {
    return this.element;
  }
}
