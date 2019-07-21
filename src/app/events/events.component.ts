import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/data.service';
import { Observable } from 'rxjs';
import { Event, Group } from '../core/data-types';
import { Router } from '@angular/router';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  private events$: Observable<Event[]>;

  constructor(
    private dataService: DataService,
    private router: Router
    ) { }

  ngOnInit() {
    this.events$ = this.dataService.getEvents().pipe();
  }
  goToEvent(eventId: string) {
    this.router.navigate(['events/' + eventId + '/edit']);
  }

  removeEvent(eventId: string) {
    console.log('removing event' + eventId);
  }
}
