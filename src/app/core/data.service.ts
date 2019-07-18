import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, Group, Criteria } from './data-types';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private eventsCollection: AngularFirestoreCollection<Event>;
  private criteriaCollection: AngularFirestoreCollection<Criteria>;

  constructor(
    private db: AngularFirestore
  ) {
    this.eventsCollection = this.db.collection('events');
   }


  getVotes() {
    return this.db.collection('votes').snapshotChanges();
  }

  getGroups() {
    console.log('calling the db groups method');
    return this.db.collection<Group>('groups');
  }

  getGroup(id: string) {
    return `This is the group ID: ${id}`;
  }

  getEvents(): Observable<any[]> {
    const eventsCollection: AngularFirestoreCollection<Event> = this.db.collection('events');
    const events: Observable<any[]> = eventsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }
      ))
    );
    return events;

  }

  getEvent(id: string) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc<Event>('events/' + id);
    const event: Observable<Event> = eventDoc.valueChanges();
    return event;
  }

  createEvent(event: Event) {
    return this.eventsCollection.add(event);
  }

  addEventCriteria(criteria: Criteria) {
    // TODO: this should do a batch create to the event, event groups and to the individual criterial
    return;

  }

  updateEvent(id: string, event: Event) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc('events/' + id);
    return eventDoc.update(event);
  }

}
