import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menus: any = [];

  constructor() {}

  register(id: string) {
    this.menus.push({
      id,
      visible: false,
    });
  }

  unRegister(id: string) {
    this.menus = this.menus.filter((el:any) => el.id !== id);
  }

  isMenuVisible(id: string): boolean {
    return !!this.menus.find((el:any) => el.id === id)?.visible;
  }

  toggleMenu(id: string) {
    const modal = this.menus.find((el:any) => el.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
