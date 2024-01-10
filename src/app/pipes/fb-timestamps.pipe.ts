import firebase from 'firebase/compat/app';
import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fbTimestamps',
})
export class FbTimestampsPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}

  transform(value: firebase.firestore.FieldValue | undefined) {
    if (!value) return '';
    const date = (value as firebase.firestore.Timestamp).toDate();
    return this.datePipe.transform(date, 'dd MMM yyyy');
  }
}
