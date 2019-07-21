import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../core/data.service';
import { Router } from '@angular/router';

interface Group {
  id: string;
  description: string;
  members: string[];
  name: string;
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  private groups$: Observable<Group[]>;

  constructor(
    private dataService: DataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.groups$ = this.dataService.getGroups().pipe();
  }

  goToGroup(groupId: string) {
    this.router.navigate(['groups/' + groupId]);
  }

  removeGroup(groupId: string) {
    console.log('Group Id: ' + groupId);
  }

}
