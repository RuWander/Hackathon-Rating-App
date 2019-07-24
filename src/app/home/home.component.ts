import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/data.service';

interface Vote {
  id: string;
  voter: string;
  criteria: string;
  value: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {

  votes: Vote[] = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getVotes().subscribe(data => {
      console.log(`This is the data object from the votes collection: ` + data);
      this.votes = [];
      data.forEach(a => {
        const vote: any = a.payload.doc.data();
        console.log(`This is the foreach vote:` + JSON.stringify(a.payload.doc.data()));
        vote.id = a.payload.doc.id;
        this.votes.push(vote);
      }

      );
    });
  }

}
