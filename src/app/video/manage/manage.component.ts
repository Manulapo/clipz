import { Iclip } from './../../services/models/clips.model';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService } from '../../services/clip.service';
import { ModalService } from '../../services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
})
export class ManageComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  videoOrder: string = '1';
  clips: Iclip[] = [];
  activeClip: Iclip | null = null;
  sort$: BehaviorSubject<string>;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      // note: 2 is the value from the select
      this.videoOrder = params['sort'] == '2' ? params['sort'] : 1;
      this.sort$.next(this.videoOrder);
    });

    // retrieve user's clips (in docs property)
    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });

    // register the modal
    this.modal.register('editClip');
  }

  ngOnDestroy() {
    this.modal.unRegister('editClip');
  }

  sort(ev: Event) {
    const { value } = ev?.target as HTMLSelectElement;

    // update queryparams

    // easy way
    // this.router.navigateByUrl(`/manage?sort=${value}`);

    // best way
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(ev: Event, clip: Iclip) {
    ev.preventDefault();

    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  update(ev: Iclip) {
    this.clips.forEach((el, idx) => {
      // update from UI
      // loop trough every clip and selecting the one that needs to be selected
      if (el.docID == ev.docID) {
        this.clips[idx].title = ev.title;
      }
    });
  }

  deleteClip(ev: Event, clip: Iclip) {
    ev.preventDefault();

    this.clipService.deleteClip(clip);

    // delete fro  UI
    this.clips.forEach((el, idx) => {
      if (el.docID == clip.docID) {
        this.clips.splice(idx, 1);
      }
    });
  }

  async copyToClipBoard(event: MouseEvent, docID: string | undefined) {
    event.preventDefault();
    if (!docID) return;
    const url = `${location.origin}/clip/${docID}`;
    await navigator.clipboard.writeText(url);
  }
}
