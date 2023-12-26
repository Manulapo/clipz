import { Injectable } from '@angular/core';
import { IModal } from './models/modal.interface';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  constructor() {}

  register(id: string) {
    this.modals.push({
      id,
      visible: false,
    });
  }

  unRegister(id: string){
    this.modals = this.modals.filter(el => el.id !== id)
  }

  isModalVisible(id: string): boolean {
    return !!this.modals.find((el) => el.id === id)?.visible;
  }

  toggleModal(id: string) {
    const modal = this.modals.find((el) => el.id === id);
    if (modal) {
      modal.visible = !modal.visible;
    }
  }
}
