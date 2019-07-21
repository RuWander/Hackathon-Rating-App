import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../core/data.service';
import { DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { Event, Group } from '../core/data-types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  id = '';
  editing = false;
  criteria = [{name: 'Project Concept'}, {name: 'Technical Innovation'}, {name: 'Interaction Exploration'}];
  groups = [{name: 'The Cool Kids'}, {name: 'Not your parents'}];
  private currentEvent$: Observable<Event>;
  event: Event;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  eventForm = new FormGroup({
    title: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  criteriaForm = new FormGroup({
    criteria: new FormControl(''),
    critStart: new FormControl(''),
    critEnd: new FormControl('')
  });

  groupForm = new FormGroup({
    name: new FormControl('')
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.editing = true;
      // console.log(`this is the ID: ${this.id}`)
      this.currentEvent$ = this.dataService.getEvent(this.id);
      this.currentEvent$.subscribe(e => {
        this.event = e;
        const d: any = e.date;
        this.eventForm.patchValue({
          title: e.title,
          date: d.toDate(),
          description: e.description
        });

      });
      console.log(this.event);
    }
    // this.group = this.dataService.getGroup(id);
    this.criteriaForm.setValue({
      criteria: '',
      critStart: 0,
      critEnd: 100
    });
  }

  createEvent() {
    console.log(this.eventForm.value);
    this.dataService.createEvent(this.eventForm.value).then(docRef => {
      console.log('This is the id if the new Event created');
      console.log((docRef) ? ( docRef as DocumentReference).id : 'void'); // docRef of type void | DocumentReference
      this.router.navigate(['events/' + docRef.id + '/edit']);
    });
  }

  updateEvent() {
    this.dataService.updateEvent(this.id, this.eventForm.value);
  }

  addCriteria() {
    this.dataService.addEventCriteria(this.id, this.criteriaForm.value);
  }

  addGroup() {
    this.dataService.addGroup(this.id, this.groupForm.value);
  }

  removeGroup(index: number) {
    this.dataService.deleteGroupFromEvent(this.id, index);
  }

  removeCritFromEvent(critId: string) {
    console.log(critId);
    this.dataService.removeCriteriaFromEvent(this.id, critId);
  }

}
