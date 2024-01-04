import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { Iclip } from './models/clips.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<Iclip> | undefined;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    // create or select clips collection on firestore database
    this.clipsCollection = db.collection('clips');
  }

  createClip(data: Iclip): Promise<DocumentReference<Iclip>> {
    // .SET function allows to put in a custom ID
    // .ADD function put in a PRE-GENERATED ID by firebase
    return this.clipsCollection!.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap((values) => {
        const [user, sort] = values;
        if (!user) {
          return of([]);
        }

        // set the QUERY configs
        const query = this.clipsCollection?.ref.where('uid', '==', user.uid).orderBy('timestamp',sort === '1' ? 'desc' : 'asc');

        // start the QUERY
        return query!.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<Iclip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection?.doc(id).update({
      title,
    });
  }

  async deleteClip(clip: Iclip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    // delete clip from storage
    await clipRef.delete();

    // delete clip data from db
    await this.clipsCollection?.doc(clip.docID).delete();
  }
}
