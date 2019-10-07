import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../core/data.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
  constructor(private auth: AuthService, private dataService: DataService) {}

  private groups: [];
  private uid: string;

  userForm = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    firstname: new FormControl(''),
    lastname: new FormControl(''),
    bio: new FormControl('')
  });

  groupForm = new FormGroup({
    name: new FormControl('')
  });

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.uid = user.uid;
      console.log(user.firstname);
      // Update form with existing data
      this.userForm.patchValue({
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        bio: user.bio
      });
      // Get all group references
      const userGroups = user.groups;
      userGroups.forEach(group => {
        console.log(group);
        group.get().then(doc => {
          const gr = doc.data();
          // this.groups.push(gr);
          console.log(doc.data());
        });
      });
    });
  }

  updateUserProfile() {
    console.log(this.userForm.value);
    const user = {
      ...this.userForm.value,
      uid: this.uid
    };

    this.auth.updateUserData(user);
  }
}
