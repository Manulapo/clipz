import {
  Component,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import { Iclip } from '../services/models/clips.model';
import { DatePipe } from '@angular/common';
import Player from "video.js/dist/types/player";

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: Player;
  clip?: Iclip;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);

    this.route.data.subscribe((data) => {
      this.clip = data.clip as Iclip;

      this.player?.src({
        src: this.clip?.url,
        type: 'video/mp4',
      });
    });

  }
}
