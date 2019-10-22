import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentSnapshot,
  DocumentSnapshotExists
} from '@angular/fire/firestore';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay, take, tap } from 'rxjs/operators';
import { Event, Group, Criteria, VoteDocument, Vote } from './data-types';
import { firestore } from 'firebase';
import * as _ from 'lodash';

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

    this.db.firestore
      .runTransaction(t => {
        return Promise.all([t.get(eventRef), t.get(criteriaRef)]).then(
          documents => {
            const [eventDoc, critDoc] = documents;
            const eventData = eventDoc.data();
            const newCrit = {
              id: critDoc.id,
              ...criteria
            };
            // Add new criteria to the event criteria key
            eventData.criteria.push(newCrit);
            // Add criteria to for voting to each group
            eventData.groups.map(g => {
              g.criteria.push({
                value: 0,
                votes: 0,
                ...newCrit
              });
            });
            // Set separate Crit document
            t.set(criteriaRef, criteria);
            // Update event with new citeria objects
            t.set(eventRef, eventData);
          }
        );
      })
      .then(result => {
        console.log('Transaction succeeded!');
      })
      .catch(err => console.log);
  }

  updateEvent(id: string, event: Event) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc(
      'events/' + id
    );
    return eventDoc.update(event);
  }

  updateEventField(id: string, fields: any) {
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc(
      'events/' + id
    );
    return eventDoc.update(fields);
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

    this.db.firestore
      .runTransaction(t => {
        return Promise.all([t.get(eventRef), t.get(groupRef)])
          .then(docs => {
            const [eventObj, groupObj] = docs;
            if (eventObj && groupObj) {
              const fullEvent = eventObj.data();
              const newEventGroup = {
                ...group,
                id: groupObj.id,
                criteria: fullEvent.criteria.map(c => {
                  c.value = 0;
                  c.vote = 0;
                  return c;
                })
              };
              fullEvent.groups.push(newEventGroup);
              group.belongsToEvent.push(eventObj.id);

              return Promise.all([
                t.set(eventObj.ref, fullEvent),
                t.set(groupObj.ref, group)
              ]);
            }
          })
          .then(docs => {
            console.log('Promise successful');
            // Return information to the users
          });
      })
      .catch(err => {
        console.log('Promise failed!');
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
        console.log(d);
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

  updateVoteForGroup(eventId, group, user) {
    console.log(eventId);
    console.log(group);
    console.log(user);
    const voteDoc: AngularFirestoreDocument<VoteDocument> = this.db.doc<
      VoteDocument
    >(`votes/${eventId}_${group.id}_${user.uid}`);
    const eventDoc: AngularFirestoreDocument<Event> = this.db.doc<Event>(
      'events/' + eventId
    );
    combineLatest(voteDoc.valueChanges(), eventDoc.valueChanges()).subscribe(
      values => {
        console.log(values);
      }
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

    this.db.firestore
      .runTransaction(t => {
        return Promise.all([t.get(eventRef), t.get(voteRef)]).then(result => {
          // Set current Vote state on Event and Vote
          const currentEvent = result[0].data();
          const currentVote = result[1].data();
          const currentGroupIndex = currentEvent.groups.findIndex(
            group => group.id === groupId
          );

          // set weather vote has been added to event
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

          // for (let x = 0; x < currentEvent.criteria.length; x++) {
          //   console.log(
          //     _.findIndex(currentVote.votes, {
          //       id: currentEvent.criteria[x].id
          //     })
          //   );
          // }

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
