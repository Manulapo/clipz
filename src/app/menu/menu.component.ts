import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None, // Set to None for global styles
})
export class MenuComponent {
  @Input() menuText = '';
  @Input() menuContentSelector = '';
  menuOpened = false;

  openMenu() {
    this.menuOpened = !this.menuOpened;
  }
}
