import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../core/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../core/data-types';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { EventVotingDialogComponent } from '../event-voting-dialog/event-voting-dialog.component';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  private event$: Observable<Event>;
  private event;
  private id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.event$ = this.dataService.getEvent(this.id).pipe(
      map(data => {
        if (data) {
          console.log(data);
          this.event = data;
          if (data.date) {
            data.date = data.date.toDate();
          }
          return data;
        } else {
          console.log('There is no event document yet');
        }
      })
    );
  }

  editEvent() {
    this.router.navigate(['events', this.id, 'edit']);
  }

  // initiateVoting() {
  //   this.dataService.updateEventField(this.id, { voting: true });
  // }

  voteGroup(groupId: string) {
    console.log(groupId);
    this.router.navigate(['events', this.id, 'vote', groupId]);
  }

  eventVotingDialog() {
    console.log('This will delete event');
    const dialogRef = this.dialog.open(EventVotingDialogComponent, {
      // width: '35%',
      data: { id: this.id, eventTitle: this.event.title, voting: this.event.voting, votingClosed: this.event.votingClosed }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if (result.votingInit) {
        console.log('voting will start now');
        this.dataService.updateEventField(this.id, { voting: true });
      } else {
        console.log('Voting will not be initialised');
      }

      if (result.closeVoting) {
        console.log('Voting will be closed');
        this.dataService.updateEventField(this.id, { votingClosed: true });
      } else {
        console.log('Voting will not be closed');
      }
      // if (result) {
      //   console.log(
      //     'This will start the voting session in this event'
      //   );
      //   this.dataService.updateEventField(this.id, { voting: true });
      // } else {
      //   console.log('The voting session will not be started');
      // }
    });
  }
}
