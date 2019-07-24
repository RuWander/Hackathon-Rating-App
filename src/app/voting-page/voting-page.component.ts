import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../core/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Event, Group, Criteria } from '../core/data-types';

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent implements OnInit {

  private event$: Observable<Event>;
  private id: string;
  private groupId: string;
  private group$: Observable<Event>;
  private eventVoteGroup: Group;
  private groupCriteria: Criteria[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.event$ = this.dataService.getEvent(this.id).pipe(
      map(data => {
        // data.date = data.date.toDate();
        return data;
      })
    );
    this.group$ = this.dataService.getGroup(this.groupId).pipe(
      map(data => {
        return data;
      })
    );
    this.event$.subscribe(g => {
      g.groups.forEach((item, i) => {
        if (item.id === this.groupId) {
          this.eventVoteGroup = item;
          this.groupCriteria = [...item.criteria];
        }
      });
    });
  }

  goBack() {
    this.location.back();
    // this.router.navigate(['event', this.id]);
  }

}
