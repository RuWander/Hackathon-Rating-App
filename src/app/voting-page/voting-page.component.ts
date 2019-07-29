import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../core/data.service';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Event, Group, Criteria, Vote, VoteDocument, User } from '../core/data-types';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.css']
})
export class VotingPageComponent implements OnInit {

  private eventId: string;
  private groupId: string;
  private event$: Observable<Event>;
  private group$: Observable<Group>;
  private user$: Observable<User> = this.auth.user$;
  private currentVote: VoteDocument;

  
  // private eventVoteGroup: Group;
  // private groupCriteria: Criteria[];
  // private currentVote$: Observable<VoteDocument>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    combineLatest(
      this.event$ = this.dataService.getEvent(this.eventId).pipe(),
      this.group$ = this.dataService.getGroup(this.groupId).pipe(),
      this.user$
      )
      .subscribe(values => {
      console.log(values);
      let grp: Group = {
        name: ''
      };
      const group = values[0].groups;
      for (let i =0; i < group.length; i++) {
        if (group[i].id === this.groupId) {
          grp = group[i];
        }
      }

      console.log(grp);
      this.dataService.createVoteForGroup(this.eventId, this.groupId, values[2].uid, [...grp.criteria]);
    });
    // this.id = this.route.snapshot.paramMap.get('id');
    // this.groupId = this.route.snapshot.paramMap.get('groupId');
    // this.event$ = this.dataService.getEvent(this.id).pipe(

    // );
    // this.group$ = this.dataService.getGroup(this.groupId).pipe(
    //   map(data => {
    //     return data;
    //   })
    // );
    // this.event$.subscribe(g => {
    //   this.eventId = g.id;
    //   g.groups.forEach((item, i) => {
    //     if (item.id === this.groupId) {
    //       this.eventVoteGroup = item;
    //       this.groupCriteria = [...item.criteria];
    //       console.log(this.eventId);
    //       // this.currentVote$ = this.dataService.createVoteForGroup(g.id, this.groupId, this.userId, [...item.criteria]);
    //     }
    //   });
    // });
    // this.auth.user$.subscribe(user => {
    //   this.userId = user.uid;
    // });
  }

  goBack() {
    this.location.back();
    // this.router.navigate(['event', this.id]);
  }

  submitVote() {
    // this.dataService.voteForGroup(this.id, this.groupId, this.groupCriteria, this.userId);
  }

}
