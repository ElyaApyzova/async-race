// src/ui/views/WinnersView.ts
import { winnersState } from '../../state/winner';
import { Pagination } from '../../ui/components/Pagination';
import { Winner, SortField } from 'types/interface';


export class WinnersView {
  private element: HTMLElement;
  private pagination: Pagination;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'winners-view';
    this.pagination = new Pagination({
      itemsPerPage: 10,
      currentPage: winnersState.page,
      totalItems: winnersState.totalCount,
      onPageChange: (page: number) => this.handlePageChange(page),
    });
    this.render();
  }

  private async handlePageChange(page: number): Promise<void> {
    winnersState.page = page;
    await winnersState.loadWinners();
    this.updatePagination();
    this.renderWinners();
  }

  private updatePagination(): void {
    this.pagination.update({
      currentPage: winnersState.page,
      totalItems: winnersState.totalCount,
    });
  }

  async render(): Promise<void> {
    await winnersState.loadWinners();

    this.element.innerHTML = `
      <h2>Winners (${winnersState.totalCount})</h2>
      <table class="winners-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Car</th>
            <th data-sort="id" class="sortable">ID</th>
            <th data-sort="wins" class="sortable">Wins</th>
            <th data-sort="time" class="sortable">Best Time (s)</th>
          </tr>
        </thead>
        <tbody class="winners-body"></tbody>
      </table>
    `;

    this.element.appendChild(this.pagination.getElement());
    this.renderWinners();
    this.addEventListeners();
  }

  private renderWinners(): void {
    const tbody = this.element.querySelector('.winners-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    winnersState.winners.forEach((winner: Winner, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" 
             class="car-icon" style="color:${winner.color}">
          <path d="M5,12 L55,12 C57,12 58,13 58,15 L58,20 C58,22 57,23 55,23 L5,23 C3,23 2,22 2,20 L2,15 C2,13 3,12 5,12 Z" 
                fill="currentColor" stroke="#333" stroke-width="0.5"/>
          <path d="M10,13 L20,13 L20,20 L10,20 Z" fill="#aad4f5" stroke="#333" stroke-width="0.3"/>
          <path d="M40,13 L50,13 L50,20 L40,20 Z" fill="#aad4f5" stroke="#333" stroke-width="0.3"/>
          <circle cx="15" cy="23" r="4" fill="#222" stroke="#111" stroke-width="0.5"/>
          <circle cx="45" cy="23" r="4" fill="#222" stroke="#111" stroke-width="0.5"/>
          <path d="M15,15 L45,15 L45,17 L15,17 Z" fill="#fff" opacity="0.8"/>
        </svg></td>
        <td>${winner.id}</td>
        <td>${winner.wins}</td>
        <td>${winner.time.toFixed(2)}</td>
      `;
      tbody.appendChild(row);
    });
  }

  private addEventListeners(): void {
    const sortableHeaders = this.element.querySelectorAll('.sortable');

    sortableHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        const sort = header.getAttribute('data-sort') as SortField;
        if (winnersState.sort === sort) {
          winnersState.order = winnersState.order === 'asc' ? 'desc' : 'asc';
        } else {
          winnersState.sort = sort;
          winnersState.order = 'asc';
        }
        this.render();
      });
    });
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
