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
import { BehaviorSubject, combineLatest, of, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Resolve,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<Iclip | null> {
  public clipsCollection: AngularFirestoreCollection<Iclip> | undefined;
  pageClips: Iclip[] = [];
  pendingReq: boolean = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
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
        const query = this.clipsCollection?.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');

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
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );

    // delete clip from storage
    await clipRef.delete();
    // delete screenshot from storage
    await screenshotRef.delete();

    // delete clip data from db
    await this.clipsCollection?.doc(clip.docID).delete();
  }

  async getClips() {
    if (this.pendingReq) return;

    this.pendingReq = true;

    let query = this.clipsCollection?.ref.orderBy('timestamp', 'desc').limit(6); //first 6 results form db

    const { length } = this.pageClips;

    if (length) {
      const lastDocId = this.pageClips[length - 1].docID;
      const lastDoc = await this.clipsCollection
        ?.doc(lastDocId)
        .get()
        .toPromise();

      query = query?.startAfter(lastDoc);
    }
    const snapshot = await query?.get();
    snapshot?.forEach((doc) =>
      this.pageClips.push({
        docID: doc.id,
        ...doc.data(),
      })
    );

    this.pendingReq = false;
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.clipsCollection!.doc(route.params.id)
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();

          if (!data) {
            this.router.navigate(['/']);
            return null;
          }

          return data;
        })
      );
  }
}
