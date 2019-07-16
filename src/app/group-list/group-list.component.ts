import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from '../core/data.service';

interface Group {
  id: string,
  description: string,
  members: string[],
  name: string
}

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {

  private groupsCollection: AngularFirestoreCollection<Group>;
  private groups: Observable<Group[]>;
  private evnt: Observable<any[]>;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.groupsCollection = this.dataService.getGroups();
    this.groups = this.groupsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Group;
        const id = a.payload.doc.id;
        console.log({id, ...data})
        return {id, ...data}
      }
      ))
    )
    this.evnt = this.dataService.getEvents()
    console.log(typeof this.groups)
  }

}
