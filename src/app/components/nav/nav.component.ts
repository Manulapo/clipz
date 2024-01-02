import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  constructor(
    public modal: ModalService,
    public auth: AuthService,
    public afAuth: AngularFireAuth
  ) {}

  openModal(modalD: string) {
    this.modal.toggleModal(modalD);
    return false;
  }

  async logOut(ev: Event) {
    ev?.preventDefault();
    this.afAuth.signOut();
  }
}
