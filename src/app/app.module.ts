import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {LoginComponent} from './components/login/login.component';
import {UserComponent} from "./components/user/user.component";
import {MainComponent} from "./components/main/main.component";
import {routing} from "./app.routing";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {AuthGuard} from "./services/auth/auth.guard";
import {AuthService} from "./services/auth/auth.service";
import {AppConfig} from "./app.config";
import {CookieService} from "ngx-cookie-service";
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpAuthInterceptor} from "./services/auth/http.auth.interceptor";
import {ForbiddenComponent} from "./components/forbidden/forbidden.component";
import { CovalentLayoutModule } from '@covalent/core/layout';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { ProfileComponent } from './components/main/profile/profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminProfileComponent } from './components/admin/admin-profile/admin-profile.component';
import {UserService} from "./services/user/user.service";
import {MatSortModule} from '@angular/material/sort';
import { AdminChairmanComponent } from './components/admin/admin-chairman/admin-chairman.component';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import { NewsComponent } from './components/main/news/news.component';
import { HolderListComponent } from './components/main/holder-list/holder-list.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import {
  MAT_DATE_LOCALE,
  MatDialogModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatPaginatorIntl,
  MatTooltipModule,
  DateAdapter, MAT_DATE_FORMATS
} from '@angular/material';
import { ApartmentListComponent } from './components/main/apartment-list/apartment-list.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { QuestionaryComponent } from './components/main/questionary/questionary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { QuestionaryActivityComponent } from './components/main/questionary/questionary-activity/questionary-activity.component';
import { QuestionaryVoteComponent } from './components/main/questionary/questionary-vote/questionary-vote.component';
import { QuestionaryResultComponent } from './components/main/questionary/questionary-result/questionary-result.component';
import { ApartmentComponent } from './components/main/apartment/apartment.component';
import {MkdService} from './services/mkd/mkd.service';
import {HolderService} from './services/holder/holder.service';
import {ApartmentService} from './services/apartment/apartment.service';
import {QuestionaryService} from './services/questionary/questionary.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { SimpleDialogComponent } from './components/simple-dialog/simple-dialog.component';
import { QuestionaryListComponent } from './components/main/questionary-list/questionary-list.component';
import { RegisterComponent } from './components/register/register.component';
import { HolderComponent } from './components/main/holder/holder.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import { QuestionaryCreateComponent } from './components/main/questionary-create/questionary-create.component';
import { QuestionaryResultFreeAnswersComponent } from './components/main/questionary/questionary-result/questionary-result-free-answers/questionary-result-free-answers.component';
import { MatPaginatorIntlRu } from "./classes/mat-paginator-intl-ru";
import {PaginationService} from "./services/pagination/pagination.service";
import { MeetingComponent } from './components/main/meeting/meeting.component';
import { MeetingActivityComponent } from './components/main/meeting/meeting-activity/meeting-activity.component';
import { MeetingResultComponent } from './components/main/meeting/meeting-result/meeting-result.component';
import { MeetingVoteComponent } from './components/main/meeting/meeting-vote/meeting-vote.component';
import { MeetingNotParticipationComponent } from './components/main/meeting/meeting-not-participation/meeting-not-participation.component';
import { MeetingInfoComponent } from './components/main/meeting/meeting-info/meeting-info.component';
import {MeetingService} from './services/meeting/meeting.service';
import {MatChipsModule} from '@angular/material/chips';
import { MeetingListComponent } from './components/main/meeting-list/meeting-list.component';
import {MeetingEditComponent} from './components/main/meeting-edit/meeting-edit.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {NgxMaskModule} from 'ngx-mask';
import {FileService} from './services/file/file.service';
import {MatRadioModule} from '@angular/material/radio';
import { ForumComponent } from './components/forum/forum.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import { SafePipe } from '../safe.pipe';

export const MY_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    MainComponent,
    ForbiddenComponent,
    ProfileComponent,
    AdminComponent,
    AdminProfileComponent,
    AdminChairmanComponent,
    NewsComponent,
    HolderListComponent,
    DeleteDialogComponent,
    ApartmentListComponent,
    ConfirmComponent,
    RegisterComponent,
    ConfirmComponent,
    QuestionaryComponent,
    QuestionaryActivityComponent,
    QuestionaryVoteComponent,
    QuestionaryResultComponent,
    ApartmentComponent,
    QuestionaryListComponent,
    HolderComponent,
    SimpleDialogComponent,
    QuestionaryCreateComponent,
    QuestionaryResultFreeAnswersComponent,
    MeetingComponent,
    MeetingActivityComponent,
    MeetingResultComponent,
    MeetingVoteComponent,
    MeetingNotParticipationComponent,
    MeetingInfoComponent,
    MeetingListComponent,
    MeetingEditComponent,
    ForumComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    CovalentLayoutModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTabsModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatRadioModule,
    NgxMaskModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'ru-Ru'
    },
    {
      provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorIntlRu
    },
    CookieService,
    AuthGuard,
    AuthService,
    AppConfig,
    LoginComponent,
    UserService,
    MkdService,
    HolderService,
    ApartmentService,
    QuestionaryService,
    PaginationService,
    MeetingService,
    FileService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DeleteDialogComponent,
    SimpleDialogComponent,
    QuestionaryResultFreeAnswersComponent
  ]

})
export class AppModule { }
