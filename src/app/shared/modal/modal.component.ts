import { Component, ElementRef, Input } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  @Input() modalID!: string;

  constructor(public modal: ModalService, public el: ElementRef) {}

  ngOnInit() {
    // WONT APPLY ANY CSS OVERRIDE TOI MODAL COMPONENT
    // document.body.appendChild(this.el.nativeElement);
  }

  closeModal() {
    this.modal.toggleModal(this.modalID);
  }
}
