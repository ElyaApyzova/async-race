import { garageState } from './state/garage';
import { GarageView } from './ui/garage/GarageView';
import { WinnersView } from './ui/winners/WinnersView';
import './styles.css';

class App {
  private garageView: GarageView;
  private winnersView: WinnersView;

  constructor() {
    this.garageView = new GarageView();
    this.winnersView = new WinnersView();
    this.init();
  }

  private init() {
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <header class="header">
          <nav class="tabs">
            <button class="tab garage-tab active">Garage</button>
            <button class="tab winners-tab">Winners</button>
          </nav>
        </header>
        <main class="main-content"></main>
      `;

      const mainContent = appContainer.querySelector('.main-content');
      if (mainContent) {
        mainContent.appendChild(this.garageView.getElement());
      }

      this.setupTabSwitching();
    }
  }

  private setupTabSwitching() {
    const garageTab = document.querySelector('.garage-tab');
    const winnersTab = document.querySelector('.winners-tab');
    const mainContent = document.querySelector('.main-content');

    if (garageTab && winnersTab && mainContent) {
      garageTab.addEventListener('click', () => {
        garageTab.classList.add('active');
        winnersTab.classList.remove('active');
        mainContent.innerHTML = '';
        mainContent.appendChild(this.garageView.getElement());
      });

      winnersTab.addEventListener('click', () => {
        winnersTab.classList.add('active');
        garageTab.classList.remove('active');
        mainContent.innerHTML = '';
        mainContent.appendChild(this.winnersView.getElement());
      });
    }
  }
}

new App();