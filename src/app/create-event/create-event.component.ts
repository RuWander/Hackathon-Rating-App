import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  criteria = [{name:'Project Concept'},{name:'Tecnical Innovation'},{name:'Interaction Exploration'}]
  groups = [{name:'The Cool Kids'},{name:'Not your parents'}]

  constructor() { }

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
    this.criteriaForm.setValue({
      criteria: '',
      critStart: 0,
      critEnd: 100
    })
  }

}
