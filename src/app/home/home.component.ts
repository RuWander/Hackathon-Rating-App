import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/data.service';
import { Event } from '../core/data-types';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  private eventsData: Event[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getEvents().subscribe(events => this.eventsData = events);
  }

}
