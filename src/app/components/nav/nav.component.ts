import { AuthService } from './../../services/auth.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'], // Fix the typo in styleUrls
})
export class NavComponent {
  @ViewChild('nav') navbar!: ElementRef;

  constructor(public modal: ModalService, public auth: AuthService) {}

  isNavbarScrolled: boolean = true;

  ngOnInit() {
    // init event listenener
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy() {
    // kill event listener
    window.removeEventListener('scroll', this.handleScroll);
  }

  openModal(modalD: string) {
    this.modal.toggleModal(modalD);
    return false;
  }

  handleScroll = () => {
    // handle scroll event
    const { scrollTop, offsetHeight } = document.documentElement;
    const compHeight = this.navbar.nativeElement.offsetHeight;
    this.isNavbarScrolled = scrollTop > compHeight;
  };
}
