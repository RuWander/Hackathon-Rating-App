import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface Group {
  id: string,
  description: string,
  members: string[],
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private db: AngularFirestore
  ) { }


  getVotes(){
    return this.db.collection('votes').snapshotChanges()
  }

  getGroups() {
    console.log('calling the db groups method')
    return this.db.collection<Group>('groups');
  }

  getGroup(id: string) {
    return `This is the group ID: ${id}`
  }

  getEvents(): Observable<any[]> {
    const eventsCollection: AngularFirestoreCollection<any> = this.db.collection('events')
    const events: Observable<any[]> = eventsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data()
        const id = a.payload.doc.id;
        return {id, ...data}
      }
      ))
    )
    return events;

  }

  getEvent(id: string) {

  }
}
