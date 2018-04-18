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
import {HolderListComponent} from "./components/main/holder-list/holder-list.component";


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
            path: 'holder-list',
            component: HolderListComponent,
          }
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
    path: 'forbidden',
    component: ForbiddenComponent
  }
];

export const routing = RouterModule.forRoot(routes);
