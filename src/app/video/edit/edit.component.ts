import { ClipService } from './../../services/clip.service';
import {
  Component,
  Input,
  OnDestroy,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Iclip } from '../../services/models/clips.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss',
})
export class EditComponent {
  @Input() activeClip: Iclip | null = null;

  @Output() update = new EventEmitter();

  constructor(private modal: ModalService, private clipService: ClipService) {}

  alertMessage: string = 'Updating Clip...';
  showAlert: boolean = false;
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  clipID = new FormControl('', { nonNullable: true });
  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  ngOnInit() {}

  ngOnChanges() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = false;
    this.showAlert = false;

    // update form on any component changes
    this.clipID.setValue(this.activeClip?.docID!);
    this.title.setValue(this.activeClip?.title);
  }

  async submit() {
    if (!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    this.alertMessage = 'Updating Clip...';
    this.alertColor = 'blue';

    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.showAlert = true;
      this.alertMessage = 'Updating Failed';
      this.alertColor = 'red';
      return;
    }

    this.inSubmission = false;
    this.showAlert = true;
    this.alertMessage = 'Clip Updated!';
    this.alertColor = 'green';

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
  }
}
