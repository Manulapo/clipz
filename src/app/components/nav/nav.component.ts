import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'], // Fix the typo in styleUrls
})
export class NavComponent {
  constructor(
    public modal: ModalService,
    public auth: AuthService,
  ) {}

  openModal(modalD: string) {
    this.modal.toggleModal(modalD);
    return false;
  }
}
