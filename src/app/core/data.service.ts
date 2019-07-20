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
    this.criteriaCollection = this.db.collection('criteria');
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

  addEventCriteria(eventId: string, criteria: Criteria) {
    const eventRef = this.db.firestore.collection('events').doc(eventId);
    const criteriaRef = this.db.firestore.collection('criteria').doc();
    const setCriteria = criteriaRef.set(criteria);

    const transaction = this.db.firestore.runTransaction(t => {
      return t.get(criteriaRef)
      .then(doc => {
        if (doc) {
          return doc;
        } else {
          console.log('No criteria document exists');
        }
      })
      .then(critDoc => {
        return t.get(eventRef).then(doc => {
          const d = doc.data();
          const c = critDoc.data();
          const newCritDoc = {id: critDoc.id, ...c};

          if (doc) {
            console.log(newCritDoc);
            t.update(criteriaRef, critDoc.data());
            if (d.criteria) {
              d.criteria.push(newCritDoc);
              const groups = d.groups;
              if (groups) {
                groups.forEach(group => {
                  const groupCriteria = group.criteria;
                  const groupCrit = {value: 0, votes: 0, ...newCritDoc};
                  if (group.criteria) {
                    console.log(groupCriteria);
                    groupCriteria.push(groupCrit);
                  } else {
                    group.criteria = [groupCrit];
                  }
                });
              }
              t.set(eventRef, d, { merge: true });
            } else {
              t.set(eventRef, {criteria: [newCritDoc]}, { merge: true });
            }

          } else {
            console.log('No event document exists');
          }
        });
      })
      .catch(err => console.log('Doc does not exist: ', err));
    })
    .then(result => console.log('Transaction successful: ', result))
    .catch(err => console.log('Transaction failure: ', err));
  }

  updateEvent(id: string, event: Event) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc('events/' + id);
    return eventDoc.update(event);
  }

  addGroup(eventId: string, group: Group) {
    const eventRef = this.db.firestore.collection('events').doc(eventId);
    const groupRef = this.db.firestore.collection('groups').doc();
    // const setCriteria = groupRef.set(group);

    const transaction = this.db.firestore.runTransaction(t => {
      return t.get(eventRef)
      .then(doc => {
        if (doc) {
          return doc;
        } else {
          console.log('No event document exists');
        }
      })
      .then(eventDoc => {
        return t.get(groupRef).then(doc => {
          if (doc) {
            t.set(doc.ref, group);
            const eventData = eventDoc.data();
            const eventGroups = eventData.groups;
            if (eventData.groups) {
              eventGroups.push(group);
              eventGroups.forEach(g => {
                g.criteria = [...eventData.criteria];
              });
              const newEvent = eventData;
              t.set(eventRef, newEvent, {merge: true});
            } else {
              const newEvent = eventData.groups = [group];
              t.set(eventRef, newEvent);
            }
          } else {
            console.log('Cannot find group');
          }
        }).catch(err => {
          console.log('Cant Get Group: ', err);
        });
      })
      .catch(err => {
        console.log('No Event Doc available: ', err);
      });

    }).then(result => {
      console.log('Transaction successful!');
    })
    .catch(err => {
      console.log('Transaction failed: ', err);
    });

  }

  // Need to unsubscribe
  deleteGroupFromEvent(eventId: string, index: number) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc<Event>('events/' + eventId);
    eventDoc.valueChanges().subscribe(doc => {
      doc.groups.splice(index, 1);
      const newDoc = doc;
      eventDoc.update(newDoc);
    });

  }

  // Need to unsubscribe
  removeCriteriaFromEvent(eventId: string, critId: string) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc<Event>('events/' + eventId);
    eventDoc.valueChanges().subscribe(doc => {

      const critDocs = doc.criteria;
      critDocs.forEach((item, i) => {
        console.log('checking...');
        if (critDocs[i].id === critId) {
          console.log(item);
          doc.criteria.splice(i, 1);
        }
      });

      const groups = doc.groups;
      groups.forEach((g, i) => {
        g.criteria.forEach((c, j) => {
          if (c.id === critId) {
            g.criteria.splice(j, 1);
          }
        });
      });

      eventDoc.update(doc);

    });
  }

}
