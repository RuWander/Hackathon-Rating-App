import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-event-dialog',
  templateUrl: './delete-event-dialog.component.html',
  styleUrls: ['./delete-event-dialog.component.css']
})
export class DeleteEventDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DeleteEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deletedEventButton(): void {
    console.log('delete turn runs');
    this.data.deleted = true;
    this.dialogRef.close();
  }

  ngOnInit() {}
}
