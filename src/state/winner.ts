// src/state/WinnersState.ts
import { Winner, SortField, SortOrder } from 'types/interface';
import { winnerService } from '@api/index';
import { WINNERS_PAGE_SIZE } from '../constants/constant';

export class WinnersState {
  private _winners: Winner[] = [];
  private _totalCount = 0;
  private _page = 1;
  private _sort: SortField = 'id';
  private _order: SortOrder = 'asc';

  async loadWinners(): Promise<void> {
    const { winners, total } = await winnerService.getWinners(
      this._page,
      WINNERS_PAGE_SIZE,
      this._sort,
      this._order
    );
    this._winners = winners;
    this._totalCount = total;
  }

  async getWinner(id: number): Promise<Winner | null> {
    try {
      return await winnerService.getWinner(id);
    } catch (error) {
      console.error('Failed to get winner:', error);
      return null;
    }
  }

  async createWinner(winner: Omit<Winner, 'id'>): Promise<Winner> {
    const createdWinner = await winnerService.createWinner(winner);
    await this.loadWinners();
    return createdWinner;
  }

  async updateWinner(id: number, winner: Omit<Winner, 'id'>): Promise<Winner> {
    const updatedWinner = await winnerService.updateWinner(id, winner);
    await this.loadWinners();
    return updatedWinner;
  }

  async deleteWinner(id: number): Promise<void> {
    await winnerService.deleteWinner(id);
    await this.loadWinners();
  }

  get winners(): Winner[] {
    return this._winners;
  }
  get totalCount(): number {
    return this._totalCount;
  }
  get page(): number {
    return this._page;
  }
  get sort(): SortField {
    return this._sort;
  }
  get order(): SortOrder {
    return this._order;
  }

  set page(newPage: number) {
    this._page = newPage;
  }
  set sort(newSort: SortField) {
    this._sort = newSort;
  }
  set order(newOrder: SortOrder) {
    this._order = newOrder;
  }
}

export const winnersState = new WinnersState();
