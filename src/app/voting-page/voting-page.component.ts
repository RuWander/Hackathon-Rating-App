import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DataService } from '../core/data.service';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  Event,
  Group,
  Criteria,
  Vote,
  VoteDocument,
  User
} from '../core/data-types';
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
  private user: User;
  private currentVote: VoteDocument;

  // private eventVoteGroup: Group;
  private groupCriteria$: Observable<VoteDocument>;
  private groupCriteria: VoteDocument;
  // private currentVote$: Observable<VoteDocument>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dataService: DataService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    combineLatest(
      (this.event$ = this.dataService.getEvent(this.eventId).pipe()),
      (this.group$ = this.dataService.getGroup(this.groupId).pipe()),
      this.user$
    ).subscribe(values => {
      // console.log(values);
      let grp: Group = {
        name: ''
      };
      const group = values[0].groups;
      for (let i = 0; i < group.length; i++) {
        if (group[i].id === this.groupId) {
          grp = group[i];
        }
      }

      // this.dataService.updateVoteForGroup(this.eventId, values[1], values[2]);

      // console.log(grp);
      this.groupCriteria$ = this.dataService.createVoteForGroup(
        this.eventId,
        this.groupId,
        values[2].uid,
        [...grp.criteria]
      );
      this.groupCriteria$.subscribe(g => (this.groupCriteria = g));
      this.user$.subscribe(u => (this.user = u));
    });
  }

  goBack() {
    this.location.back();
    // this.router.navigate(['event', this.id]);
  }

  submitVote() {
    this.dataService.voteForGroup(
      this.eventId,
      this.groupId,
      this.groupCriteria,
      this.user.uid
    );
  }
}
