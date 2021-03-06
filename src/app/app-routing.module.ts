import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VotingPageComponent } from './voting-page/voting-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { EventsComponent } from './events/events.component';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { AuthGuard } from './core/auth.guard';
import { EventDetailComponent } from './event-detail/event-detail.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'voting', component: VotingPageComponent},
  {path: 'groups', component: GroupListComponent},
  {path: 'groups/:id', component: GroupDetailComponent},
  {path: 'user', component: UserPageComponent, canActivate: [AuthGuard]},
  {path: 'events', component: EventsComponent},
  {path: 'events/:id', component: EventDetailComponent},
  {path: 'create-event', component: CreateEventComponent},
  {path: 'events/:id/edit', component: CreateEventComponent},
  {path: 'events/:id/vote/:groupId', component: VotingPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
