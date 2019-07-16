import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../core/data.service';
import { DocumentReference } from '@angular/fire/firestore';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  id:string = '';
  editing = false;
  criteria = [{name:'Project Concept'},{name:'Technical Innovation'},{name:'Interaction Exploration'}]
  groups = [{name:'The Cool Kids'},{name:'Not your parents'}]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) { }

  eventForm = new FormGroup({
    title: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl(''),
  });

  criteriaForm = new FormGroup({
    criteria: new FormControl(''),
    critStart: new FormControl(''),
    critEnd: new FormControl('')
  })

  groupForm = new FormGroup({
    group: new FormControl('')
  })

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if(this.id) {
      this.editing = true;
      console.log(`this is the ID: ${this.id}`)
    }
    // this.group = this.dataService.getGroup(id);
    this.criteriaForm.setValue({
      criteria: '',
      critStart: 0,
      critEnd: 100
    })
  }

  createEvent() {
    console.log(this.eventForm.value);
    this.dataService.createEvent(this.eventForm.value).then(docRef => {
      console.log('This is the id if the new Event created')
      console.log((docRef) ? (<DocumentReference>docRef).id : 'void') // docRef of type void | DocumentReference
      this.router.navigate(['events/'+docRef.id+'/edit'])
    })
  }

  updateEvent() {
    this.dataService.updateEvent(this.id,this.eventForm.value)
  }

}
