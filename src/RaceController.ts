import { Car } from './ui/components/Car';
import { winnersState } from './state/winner';
import { Modal } from './ui/components/Modal';
import { Winner } from './types/interface';

export interface RaceResult {
  carId: number;
  time: number;
  success: boolean;
  carName: string;
}

export class RaceController {
  private cars: Car[];
  private raceResults: RaceResult[] = [];
  private modal: Modal = new Modal();
  private isRaceInProgress = false;

  constructor(cars: Car[]) {
    this.cars = cars;
  }

  public async startRace(): Promise<void> {
    if (this.isRaceInProgress) return;
    this.isRaceInProgress = true;
    this.raceResults = [];

    try {
      // Start all cars simultaneously
      const racePromises = this.cars.map(car => 
        car.startRace()
          .then(time => ({
            carId: car.id,
            time: time || 0,
            success: time !== null,
            carName: car.name
          }))
          .catch(() => ({
            carId: car.id,
            time: 0,
            success: false,
            carName: car.name
          }))
      );

      const results = await Promise.all(racePromises);
      this.raceResults = results;

      const winner = this.determineWinner();
      if (winner) {
        this.modal.show(`Winner: ${winner.carName} (${(winner.time / 1000).toFixed(2)}s)`);
        await this.handleWinner(winner);
      }
    } finally {
      this.isRaceInProgress = false;
    }
  }

  private determineWinner(): RaceResult | null {
    const successfulResults = this.raceResults.filter((r) => r.success);
    if (successfulResults.length === 0) return null;

    return successfulResults.reduce((prev, current) => 
      (prev.time < current.time ? prev : current)
    );
  }

  private async handleWinner(winner: RaceResult): Promise<void> {
    const winnerTime = (winner.time / 1000).toFixed(2);
    this.modal.show(`Winner: ${winner.carName} (${winnerTime}s)`);

    try {
      const existingWinner = await winnersState.getWinner(winner.carId);
      if (existingWinner) {
        await winnersState.updateWinner(existingWinner.id, {
          wins: existingWinner.wins + 1,
          time: Math.min(existingWinner.time, winner.time),
        });
      } else {
        await winnersState.createWinner({
          wins: 1,
          time: winner.time,
        });
      }
    } catch (error) {
      console.error('Failed to update winners:', error);
    }
  }

  public async resetRace(): Promise<void> {
    await Promise.all(this.cars.map((car) => car.resetCar()));
    this.raceResults = [];
  }

  public getRaceResults(): RaceResult[] {
    return this.raceResults;
  }
}