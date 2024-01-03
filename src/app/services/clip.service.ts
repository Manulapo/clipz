import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Iclip } from './models/clips.model';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<Iclip> | undefined;

  constructor(private db: AngularFirestore) {
    // create or select clips collection on firestore database
    this.clipsCollection = db.collection('clips')
  }

  async createClip(data: Iclip){
    // .SET function allows to put in a custom ID
    // .ADD function put in a PRE-GENERATED ID by firebase
    await this.clipsCollection?.add(data);
  }
}
