import { Component } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent {

  constructor(public modal: ModalService) {}

  ngOnInit() {
    this.modal.register('auth');
  }

  ngOnDestroy(){
    this.modal.unRegister('auth')
  }
}
