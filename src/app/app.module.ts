import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

import { MaterialModule } from './material';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material';
import { HomeComponent } from './home/home.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VotingPageComponent } from './voting-page/voting-page.component';
import { UserPageComponent } from './user-page/user-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { EventsComponent } from './events/events.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { GroupListComponent } from './group-list/group-list.component';
import { GroupDetailComponent } from './group-detail/group-detail.component';
import { CreateEventComponent } from './create-event/create-event.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventsResultsDisplayComponent } from './events-results-display/events-results-display.component';
import { ResultsBlocksComponent } from './results-blocks/results-blocks.component';
import { DeleteEventDialogComponent } from './delete-event-dialog/delete-event-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginPageComponent,
    RegisterPageComponent,
    DashboardComponent,
    VotingPageComponent,
    UserPageComponent,
    EventsComponent,
    GroupListComponent,
    GroupDetailComponent,
    CreateEventComponent,
    EventDetailComponent,
    EventsResultsDisplayComponent,
    ResultsBlocksComponent,
    DeleteEventDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MaterialModule,
    ReactiveFormsModule,
    MatInputModule,
    FlexLayoutModule,
    MatDialogModule
  ],
  providers: [
    DeleteEventDialogComponent,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } }
  ],
  bootstrap: [AppComponent],
  entryComponents: [DeleteEventDialogComponent]
})
export class AppModule {}
