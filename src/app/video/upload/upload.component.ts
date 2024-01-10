import { FfmpegService } from './../../services/ffmpeg.service';
import { Component, OnDestroy } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, last, switchMap, forkJoin } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { ClipService } from '../../services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
})
export class UploadComponent implements OnDestroy {
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router,
    public ffmpeg: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
    // init ffmpeg service for screenshots load
    this.ffmpeg.init();
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
  task?: AngularFireUploadTask | null = null;

  screenshots: string[] = [];
  selectedScreenshots: string = '';
  screenshotTask?: AngularFireUploadTask;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    // nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  ngOnDestroy(): void {
    // stop upload to firebase, if component is destroyed
    this.task?.cancel();
  }

  async storeFile(event: Event) {
    this.isFileValid = false;
    this.isDragOver = false;

    // store the file through drag n drop or directly through an input file
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      alert('Only mp4 video are Allowed');
      return;
    }

    this.isFileValid = true;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    // console.log(event, this.file);

    // storte screen in screenshots variable to dispaly in template
    this.screenshots = await this.ffmpeg.getScreenshots(this.file);

    this.selectedScreenshots = this.screenshots[0];
  }

  changeSelectedScreen(screenshot: string) {
    this.selectedScreenshots = screenshot;
  }

  async uploadFile() {
    // disable form
    this.uploadForm.disable();

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
    const screenshotPath = `screenshots/${clipFileName}.png`;

    // upload also selected screenshot
    const screenshotBlob = await this.ffmpeg.blobFromUrl(
      this.selectedScreenshots
    );

    // actually stores it in firebase
    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);
    const screenshotRef = this.storage.ref(screenshotPath);
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);

    // upload video
    combineLatest(
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges()
    ).subscribe((progress) => {
      const [clipProgress, screeshotProgress] = progress;
      if (!clipProgress || !screeshotProgress) return;

      const total = clipProgress + screeshotProgress;
      this.percentage = (total as number) / (100 * 2);
    });
    this.inSubmission = false;
    // handling upèload errors
    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        // since the snapshot has a state value that state "success" when the file is finally uploaded, i just want to take the last istance of the observable in order to get that state. (last operator is what i need)
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipUrl, screenshotUrl] = urls
          // preparing video data to be stored on DB after get stored as mp4 file
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value as string,
            fileName: `${clipFileName}.mp4`,
            url: clipUrl,
            screenshotURL: screenshotUrl,
            screenshotFileName: `${clipFileName}.png`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipsService.createClip(clip);

          console.log('clip:', clip);
          this.alertColor = 'green';
          this.alertMessage =
            'Success! your clip is now ready to be shared with the world!';
          this.showPercentage = false;

          // automatic redirect to the actual clip page (creating link)
          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          // enable form to handle errors
          this.uploadForm.enable();

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
