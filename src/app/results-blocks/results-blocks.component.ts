import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/data.service';
import { Event } from '../core/data-types';
import * as _ from 'lodash';

@Component({
  selector: 'app-results-blocks',
  templateUrl: './results-blocks.component.html',
  styleUrls: ['./results-blocks.component.css']
})
export class ResultsBlocksComponent implements OnInit {
  private eventsData: Event[] = [];
  // should be worked into data in database
  private groupTotals = [];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getEvents().subscribe(events => {
      this.eventsData = events;
      events.map(event => {
        event.groups.forEach(group => {
          const newGroup = { id: group.id, totalValue: 0 };
          console.log(group.criteria);
          group.criteria.map(crit => {
            newGroup.totalValue += crit.value;
          });
          newGroup.totalValue = newGroup.totalValue / group.criteria.length;
          this.groupTotals.push(newGroup);
          console.log('returning group with total');
          group.critTotal = newGroup.totalValue;
          // return {
          //   ...group,
          //   critTotal: newGroup.totalValue
          // }
          // this.groupTotals = _.orderBy(this.groupTotals, ['totalValue'], ['asc']);
        });
        event.groups = _.orderBy(event.groups, ['critTotal'], ['desc']);
      });
      console.log(this.groupTotals);
      console.log(events);
    });

  }

}
