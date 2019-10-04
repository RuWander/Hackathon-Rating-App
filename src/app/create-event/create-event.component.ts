import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../core/data.service';
import { DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';
import { Event, Group } from '../core/data-types';
import { Observable } from 'rxjs';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { DeleteEventDialogComponent } from '../delete-event-dialog/delete-event-dialog.component';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {
  id = '';
  editing = false;
  private currentEvent$: Observable<Event>;
  event: Event;
  groupLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  eventForm = new FormGroup({
    title: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl('')
  });

  criteriaForm = new FormGroup({
    name: new FormControl(''),
    critStart: new FormControl(''),
    critEnd: new FormControl('')
  });

  groupForm = new FormGroup({
    name: new FormControl('')
  });

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(`This is the ID: ${this.id}`);
    if (this.id) {
      this.editing = true;
      // console.log(`this is the ID: ${this.id}`)
      this.currentEvent$ = this.dataService.getEvent(this.id);
      this.currentEvent$.subscribe(e => {
        this.event = e;
        console.log('This is the event:' + e);
        let d: any = '';
        if (e.date) {
          d = e.date.toDate();
        }
        this.eventForm.patchValue({
          title: e.title,
          date: d,
          description: e.description
        });
      });
      console.log(this.event);
    }
    // this.group = this.dataService.getGroup(id);
    this.criteriaForm.setValue({
      name: '',
      critStart: 0,
      critEnd: 100
    });
  }

  createEvent() {
    console.log(this.eventForm.value);
    this.dataService.createEvent(this.eventForm.value).then(docRef => {
      console.log('This is the id if the new Event created');
      console.log(docRef ? (docRef as DocumentReference).id : 'void'); // docRef of type void | DocumentReference
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
    this.groupLoading = true;
    this.dataService.addGroup(this.id, this.groupForm.value);
    this.groupLoading = false;
  }

  removeGroup(critId: string) {
    this.groupLoading = true;
    setTimeout(a => console.log('delay...'), 2000);
    this.dataService.deleteGroupFromEvent(this.id, critId);
    this.groupLoading = false;
  }

  removeCritFromEvent(critId: string) {
    console.log(critId);
    this.dataService.removeCriteriaFromEvent(this.id, critId);
  }

  doneEditing() {
    this.router.navigate(['events', this.id]);
  }

  deleteEventDialog() {
    console.log('This will delete event');
    const dialogRef = this.dialog.open(DeleteEventDialogComponent, {
      // width: '35%',
      data: { id: this.id, eventTitle: this.event.title }
    });

    dialogRef.afterClosed().subscribe(deleteResult => {
      console.log('The dialog was closed');
      console.log(deleteResult);
      if (deleteResult) {
        console.log(
          'this event will be deleted navigate to deleted events page'
        );
        this.dataService.removeEvent(this.id);
        this.router.navigate(['create-event']);
      } else {
        console.log('the deletion was denied, stay on page');
      }
    });
  }
}
