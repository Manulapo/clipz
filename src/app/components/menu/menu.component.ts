import { Component, Input, ViewEncapsulation } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None, // Set to None for global styles
})
export class MenuComponent {
  constructor(public menu: MenuService){}

  @Input() menuText = '';
  @Input() menuContentSelector = '';
  @Input() menuID = '';
  menuOpened: boolean = false;

  openMenu() {
    this.menuOpened = !this.menuOpened;
  }

  closeMenu() {
    this.menu.toggleMenu(this.menuID);
  }
}
