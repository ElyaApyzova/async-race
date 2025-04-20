import { garageState } from '../../state/garage';
import { winnersState } from '../../state/winner';

export interface IPaginationOptions {
  itemsPerPage: number;
  currentPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export class Pagination {
  private element: HTMLElement;
  private options: IPaginationOptions;

  constructor(options: IPaginationOptions) {
    this.element = document.createElement('div');
    this.element.className = 'pagination';
    this.options = options;
    this.render();
  }

  private render(): void {
    const totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);

    this.element.innerHTML = `
      <button class="btn prev-btn" ${this.options.currentPage <= 1 ? 'disabled' : ''}>← Prev</button>
      <span class="page-info">Page ${this.options.currentPage} of ${totalPages}</span>
      <button class="btn next-btn" ${this.options.currentPage >= totalPages ? 'disabled' : ''}>Next →</button>
    `;

    this.addEventListeners();
  }

  private addEventListeners(): void {
    this.element.querySelector('.prev-btn')?.addEventListener('click', () => {
      if (this.options.currentPage > 1) {
        this.options.onPageChange(this.options.currentPage - 1);
      }
    });

    this.element.querySelector('.next-btn')?.addEventListener('click', () => {
      const totalPages = Math.ceil(this.options.totalItems / this.options.itemsPerPage);
      if (this.options.currentPage < totalPages) {
        this.options.onPageChange(this.options.currentPage + 1);
      }
    });
  }

  public update(options: Partial<IPaginationOptions>): void {
    this.options = { ...this.options, ...options };
    this.render();
  }

  getElement(): HTMLElement {
    return this.element;
  }
}
