import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-event-voting-dialog',
  templateUrl: './event-voting-dialog.component.html',
  styleUrls: ['./event-voting-dialog.component.css']
})
export class EventVotingDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<EventVotingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // deletedEventButton(): void {
  //   console.log('delete turn runs');
  //   this.data.deleted = true;
  //   this.dialogRef.close();
  // }

  ngOnInit() { }
}

