import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  @Input() menuText!: string;
  isMenuOpen: boolean = false;

  constructor(private menuService: MenuService) {
    this.menuService.isMenuOpen$.subscribe((isOpen) => {
      this.isMenuOpen = isOpen;
    });
  }

  ngOnInit() {}

  toggleMenu() {
    this.menuService.toggleMenu();
  }

  closeMenu() {
    this.menuService.closeMenu();
  }

}
