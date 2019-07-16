import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  editing = false;
  criteria = [{name:'Project Concept'},{name:'Tecnical Innovation'},{name:'Interaction Exploration'}]
  groups = [{name:'The Cool Kids'},{name:'Not your parents'}]

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    let id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.editing = true;
      console.log(`this is the ID: ${id}`)
    }
    // this.group = this.dataService.getGroup(id);
    this.criteriaForm.setValue({
      criteria: '',
      critStart: 0,
      critEnd: 100
    })
  }

}
