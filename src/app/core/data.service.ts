import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { Event, Group, Criteria, VoteDocument, Vote } from './data-types';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private eventsCollection: AngularFirestoreCollection<Event>;
  private criteriaCollection: AngularFirestoreCollection<Criteria>;

  constructor(private db: AngularFirestore) {
    this.eventsCollection = this.db.collection('events');
    this.criteriaCollection = this.db.collection('criteria');
  }

  getVotes() {
    return this.db.collection('votes').snapshotChanges();
  }

  getGroups(): Observable<Group[]> {
    const groupsCollection: AngularFirestoreCollection<
      Group
    > = this.db.collection('groups');
    return groupsCollection
      .valueChanges({ idField: 'id' })
      .pipe(shareReplay(1));
  }

  getGroup(id: string) {
    const groupRef: AngularFirestoreDocument<Group> = this.db.doc<Group>(
      'groups/' + id
    );
    const groupDoc = groupRef.valueChanges().pipe(shareReplay(1));
    // console.log(groupDoc);
    return groupDoc;
  }

  getEvents(): Observable<Event[]> {
    const eventsCollection: AngularFirestoreCollection<
      Event
    > = this.db.collection('events');
    return eventsCollection
      .valueChanges({ idField: 'id' })
      .pipe(shareReplay(1));
  }

  getEvent(id: string): Observable<Event> {
    const eventRef: AngularFirestoreDocument<Event> = this.db.doc<Event>(
      'events/' + id
    );
    const event: Observable<Event> = eventRef
      .valueChanges()
      .pipe(shareReplay(1));
    return event;
  }

  createEvent(event: Event) {
    return this.eventsCollection.add(event);
  }

  addEventCriteria(eventId: string, criteria: Criteria) {
    const eventRef = this.db.firestore.collection('events').doc(eventId);
    const criteriaRef = this.db.firestore.collection('criteria').doc();
    const setCriteria = criteriaRef.set(criteria);

    const transaction = this.db.firestore
      .runTransaction(t => {
        return t
          .get(criteriaRef)
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
              const newCritDoc = { id: critDoc.id, ...c };

              if (doc) {
                // console.log(newCritDoc);
                t.update(criteriaRef, critDoc.data());
                if (d.criteria) {
                  d.criteria.push(newCritDoc);
                  const groups = d.groups;
                  if (groups) {
                    groups.forEach(group => {
                      const groupCriteria = group.criteria;
                      const groupCrit = { value: 0, votes: 0, ...newCritDoc };
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
                  t.set(eventRef, { criteria: [newCritDoc] }, { merge: true });
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
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc(
      'events/' + id
    );
    return eventDoc.update(event);
  }

  removeEvent(id: string) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc(
      'events/' + id
    );
    return eventDoc.delete();
  }

  addGroup(eventId: string, group: Group) {
    const eventRef = this.db.firestore.collection('events').doc(eventId);
    const groupRef = this.db.firestore.collection('groups').doc();
    // const setCriteria = groupRef.set(group);

    const transaction = this.db.firestore
      .runTransaction(t => {
        return t
          .get(eventRef)
          .then(doc => {
            if (doc) {
              return doc;
            } else {
              console.log('No event document exists');
            }
          })
          .then(eventDoc => {
            return t
              .get(groupRef)
              .then(doc => {
                console.log(doc.id);
                if (doc) {
                  t.set(doc.ref, group);
                  const eventData = eventDoc.data();
                  const eventGroups = eventData.groups;
                  group.id = doc.id;
                  const newGroupCriteria = [...eventData.criteria];
                  newGroupCriteria.map(c => {
                    c.value = 0;
                    c.vote = 0;
                    return c;
                  });
                  if (eventData.groups && eventGroups.length !== 0) {
                    eventGroups.push(group);
                    eventGroups.forEach(g => {
                      g.criteria = [...newGroupCriteria];
                    });
                    const newEvent = eventData;
                    t.set(eventRef, newEvent, { merge: true });
                  } else {
                    eventData.groups = [group];
                    eventData.groups[0].criteria = [...newGroupCriteria];
                    const newEvent = eventData;
                    t.set(eventRef, newEvent, { merge: true });
                  }
                } else {
                  console.log('Cannot find group');
                }
              })
              .catch(err => {
                console.log('Cant Get Group: ', err);
              });
          })
          .catch(err => {
            console.log('No Event Doc available: ', err);
          });
      })
      .then(result => {
        console.log('Transaction successful!');
      })
      .catch(err => {
        console.log('Transaction failed: ', err);
      });
  }

  // Need to unsubscribe
  deleteGroupFromEvent(eventId: string, groupId: string) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc<Event>(
      'events/' + eventId
    );
    eventDoc.valueChanges().subscribe(cEvent => {
      const newGroup = cEvent.groups;
      newGroup.forEach((item, i) => {
        if (item.id === groupId) {
          cEvent.groups.splice(i, 1);
        }
      });
      console.log(cEvent);
      eventDoc.update(cEvent);
    });
  }

  // Need to unsubscribe
  removeCriteriaFromEvent(eventId: string, critId: string) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc<Event>(
      'events/' + eventId
    );
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

  createVoteForGroup(
    eventId: string,
    groupId: string,
    userId: string,
    criteria: Criteria[]
  ): Observable<VoteDocument> {
    let voteCrit: VoteDocument;
    const voteDoc: AngularFirestoreDocument<VoteDocument> = this.db.doc<
      VoteDocument
    >(`votes/${eventId}_${groupId}_${userId}`);
    return voteDoc.valueChanges().pipe(
      map(d => {
        if (!d) {
          console.log('Document does not exist, create empty vote');
          const voteD: VoteDocument = {
            eventId,
            groupId,
            userId,
            counted: false,
            votes: criteria.map(crit => {
              console.log('this is the crit' + crit.criteria);
              const v: Vote = {
                name: crit.name,
                criteriaId: crit.id,
                value: 0
              };
              return v;
            })
          };
          console.log('setting document');
          voteDoc.set(voteD);
          voteCrit = voteD;
          return voteCrit;
        } else {
          // console.log('Document exists, just return current vote data' + JSON.stringify(d));
          return d;
        }
      }),
      shareReplay(1)
    );
  }

  // Commit Vote Transaction
  voteForGroup(
    eventId: string,
    groupId: string,
    newVotes: VoteDocument,
    userId: string
  ) {
    const eventRef = this.db.firestore.collection('events').doc(eventId);
    const voteRef = this.db.firestore
      .collection('votes')
      .doc(`${eventId}_${groupId}_${userId}`);

    const transaction = this.db.firestore
      .runTransaction(t => {
        return Promise.all([t.get(eventRef), t.get(voteRef)]).then(result => {
          // Set current Vote state on Event and Vote
          const currentEvent = result[0].data();
          const currentVote = result[1].data();
          const currentGroupIndex = currentEvent.groups.findIndex(
            group => group.id === groupId
          );

          // set weather vote have been added to event
          newVotes.counted = true;
          // voteDifference used to update event group vote
          const voteDifference = this.compareVote(currentVote, newVotes);

          // Update specific group vote on event
          currentEvent.groups[currentGroupIndex].criteria.map(c => {
            if (!currentVote.counted) {
              c.vote++;
            }
            voteDifference.forEach(vD => {
              if (vD.criteriaId === c.id) {
                c.value = c.value + vD.value;
              }
            });
            return c;
          });

          // Set New Vote State
          t.set(eventRef, currentEvent);
          t.set(voteRef, newVotes);
          // console.log('transaction successful');
        });
      })
      .then(result => {
        console.log('Transaction successful!');
      })
      .catch(err => {
        console.log('Transaction error: ' + err);
      });
  }

  private compareVote(oldVote: any, newVote: VoteDocument) {
    return oldVote.votes.map((v, i) => {
      newVote.votes.forEach(nV => {
        if (v.criteriaId === nV.criteriaId) {
          v.value = nV.value - v.value;
        }
      });
      return v;
    });
  }
}
