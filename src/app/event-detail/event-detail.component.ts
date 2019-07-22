import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../core/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event } from '../core/data-types';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {

  private event$: Observable<Event>;
  private id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.event$ = this.dataService.getEvent(this.id).pipe(
      map(data => {
        data.date = data.date.toDate();
        return data;
      })
    );
  }

  editEvent() {
    this.router.navigate(['events', this.id, 'edit']);
  }

  voteGroup(groupId: string) {
    console.log(groupId);
    this.router.navigate(['events', this.id, 'vote', groupId]);
  }

}
