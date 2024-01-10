import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrl: './clips-list.component.scss',
  providers: [DatePipe],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  @Input() scrollable: boolean = true;

  constructor(public clipService: ClipService) {
    this.clipService.getClips();
  }

  ngOnInit() {
    // init event listenener
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy() {
    // kill event listener
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    // reset pageclips
    this.clipService.pageClips = [];
  }

  handleScroll = () => {
    // handle scroll event
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight == offsetHeight;

    if (bottomOfWindow) {
      // after reachinbgf footer page trigger event
      this.clipService.getClips();
    }
  };
}
