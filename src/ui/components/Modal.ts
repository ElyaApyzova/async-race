export class Modal {
  private element: HTMLElement;
  private overlay: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'modal hidden';
    this.overlay = document.createElement('div');
    this.overlay.className = 'modal-overlay hidden';
    
    this.element.innerHTML = `
      <div class="modal-content">
        <button class="close-btn">&times;</button>
        <div class="modal-message"></div>
      </div>
    `;

    document.body.appendChild(this.element);
    document.body.appendChild(this.overlay);

    this.element.querySelector('.close-btn')?.addEventListener('click', () => this.hide());
    this.overlay.addEventListener('click', () => this.hide());
  }

  show(message: string) {
    const messageEl = this.element.querySelector('.modal-message');
    if (messageEl) messageEl.textContent = message;
    this.element.classList.remove('hidden');
    this.overlay.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
    this.overlay.classList.add('hidden');
  }
}