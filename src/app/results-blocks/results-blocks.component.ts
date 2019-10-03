import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/data.service';
import { Event } from '../core/data-types';
import { group } from '@angular/animations';

@Component({
  selector: 'app-results-blocks',
  templateUrl: './results-blocks.component.html',
  styleUrls: ['./results-blocks.component.css']
})
export class ResultsBlocksComponent implements OnInit {
  private eventsData: Event[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getEvents().subscribe(events => {
      // console.log(events);
      this.eventsData = events;
      events.map(event => {
        event.groups.map((group, i) => {
          const newCrits = [...group.criteria];
          console.log(typeof newCrits);
        });
      });
    });
  }
}
