import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./services/auth/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {UserComponent} from "./components/user/user.component";
import {ForbiddenComponent} from "./components/forbidden/forbidden.component";
import {AdminComponent} from "./components/admin/admin.component";
import {AdminProfileComponent} from "./components/admin/admin-profile/admin-profile.component";
import {AdminChairmanComponent} from "./components/admin/admin-chairman/admin-chairman.component";
import {NewsComponent} from "./components/main/news/news.component";
import {ApartmentListComponent} from "./components/main/apartment-list/apartment-list.component";
import {ConfirmComponent} from "./components/confirm/confirm.component";
import {QuestionaryComponent} from './components/main/questionary/questionary.component';
import {QuestionaryListComponent} from "./components/main/questionary-list/questionary-list.component";
import {ApartmentComponent} from './components/main/apartment/apartment.component';
import {RegisterComponent} from "./components/register/register.component";
import {HolderComponent} from './components/main/holder/holder.component';
import {QuestionaryCreateComponent} from "./components/main/questionary-create/questionary-create.component";
import {MeetingComponent} from './components/main/meeting/meeting.component';
import {MeetingListComponent} from "./components/main/meeting-list/meeting-list.component";
import {MeetingEditComponent} from './components/main/meeting-edit/meeting-edit.component';
import {MeetingVoteComponent} from './components/main/meeting/meeting-vote/meeting-vote.component';
import {RedirectComponent} from './components/redirect/redirect.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: UserComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            component: NewsComponent,
          },
          {
            path: 'apartments-list',
            component: ApartmentListComponent,
          },
          {
            path: 'apartment',
            component: ApartmentComponent,
          },
          {
            path: 'apartment/:id',
            component: ApartmentComponent,
          },
          {
            path: 'apartment/:apartmentId/holder',
            component: HolderComponent,
          },
          {
            path: 'holder/:id',
            component: HolderComponent,
          },
          {
            path: 'questionary/:id',
            component: QuestionaryComponent
          },
          {
            path: 'questionary-list',
            component: QuestionaryListComponent,
          },
          {
            path: 'questionary-create',
            component: QuestionaryCreateComponent,
          },
          {
            path: 'questionary-create/:id',
            component: QuestionaryCreateComponent,
          },
          {
            path: 'meeting-list',
            component: MeetingListComponent,
          },
          {
            path: 'meeting/:id',
            component: MeetingComponent,
          },
          {
            path: 'meeting-not-participation/:id/:holderId',
            component: MeetingVoteComponent,
          },
          {
            path: 'meeting-edit',
            component: MeetingEditComponent
          },
          {
            path: 'meeting-edit/:id',
            component: MeetingEditComponent
          },
          {
            path: 'forum',
            component: RedirectComponent,
            resolve: {
              url: 'externalUrlRedirectResolver'
            },
            data: {
              externalUrl: 'http://forum-mkd.sibir.local'
            }
          },
        ]
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: {
          expectedRole: 'ROLE_ADMIN'
        },
        children: [
          {
            path: '',
            component: AdminProfileComponent,
          },
          {
            path: 'chairman',
            component: AdminChairmanComponent
          }
        ]
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register/:login',
    component: RegisterComponent
  },
  {
    path: 'confirm/:login/:type/:key',
    component: ConfirmComponent
  },
  {
    path: 'forbidden',
    component: ForbiddenComponent
  }
];

export const routing = RouterModule.forRoot(routes);
