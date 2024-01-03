import { Component } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ClipService } from '../../services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent {
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService : ClipService
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  isDragOver: boolean = false;
  file: File | null = null;
  isFileValid: boolean = false;
  percentage: string | number = 0;
  showPercentage: boolean = false;

  alertMessage: string = 'Please Wait, your clip is being uploaded.';
  showAlert: boolean = false;
  alertColor: string = 'blue';
  inSubmission: boolean = false;

  user: firebase.User | null = null;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    // nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  ngOnInit() {}

  storeFile(event: Event) {
    this.isFileValid = false;
    this.isDragOver = false;
    // store the file
    this.file = (event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      alert('Only mp4 video are Allowed');
      return;
    }

    this.isFileValid = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    console.log(event, this.file);
  }

  uploadFile() {
    this.showAlert = true;
    this.alertMessage = 'Please Wait, your clip is being uploaded';
    this.alertColor = 'blue';
    this.inSubmission = true;

    this.showPercentage = true;

    console.log('File Uploaded');
    // generate a unique id for the file ( from uuid external library )
    const clipFileName = uuid();

    // server storage path
    const clipPath: string = `clips/${clipFileName}.mp4`;

    // actually stores it in firebase
    const task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    task
      .percentageChanges()
      .subscribe((progress) => (this.percentage = (progress as number) / 100));
    this.inSubmission = false;
    // handling upèload errors
    task
      .snapshotChanges()
      .pipe(
        // since the snapshot has a state value that state "success" when the file is finally uploaded, i just want to take the last istance of the observable in order to get that state. (last operator is what i need)
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: (url) => {
          // preparing video data to be stored on DB after get stored as mp4 file
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value as string,
            fileName: `${clipFileName}.mp4`,
            url,
          };

          this.clipsService.createClip(clip)

          console.log('clip:',clip)
          this.alertColor = 'green';
          this.alertMessage =
            'Success! your clip is now ready to be shared with the world!';
          this.showPercentage = false;
        },
        error: (error) => {
          this.alertColor = 'red';
          this.alertMessage = 'Upload Failed, Please try again later';
          this.showPercentage = false;
          this.inSubmission = true;
          console.error(error);
        },
      });
    this.inSubmission = false;
  }
}
