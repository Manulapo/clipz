import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { response } from 'express';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  public isReady: boolean = false;
  private ffmpeg;

  constructor() {
    this.ffmpeg = createFFmpeg({
      log: true,
    });
  }

  async init() {
    if (this.isReady) {
      return;
    }

    await this.ffmpeg.load();
    this.isReady = true;
  }

  async getScreenshots(file: File) {
    const data = await fetchFile(file);
    // store in memory files (fle storage)
    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds: string[] = ['01', '05', '10'];
    const commands: string[] = [];

    // getting options for 3 screenshots
    seconds.forEach((second, idx) => {
      commands.push(
        // input
        '-i',
        file.name,
        // ouput options
        '-ss',
        `00:00:${second}`,
        '-frames:v',
        '1',
        '-filter:v',
        'scale=510:-1',
        // output name
        `output_0${idx}.png`
      );
    });

    // getting screenshots
    await this.ffmpeg.run(...commands);

    const screenshots: string[] = [];

    // grab screen form FS (return binary data at first)
    seconds.forEach((second, idx) => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${idx}.png`);
      // create image url through BLOB function (convert binary data to url)
      const screenshotBlob = new Blob([screenshotFile.buffer], {
        type: 'image/png',
      });

      const screenShotURL = URL.createObjectURL(screenshotBlob);

      screenshots.push(screenShotURL);
    });

    return screenshots;
  }

  async blobFromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
