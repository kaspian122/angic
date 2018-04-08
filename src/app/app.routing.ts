import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "./services/auth/auth.guard";
import {LoginComponent} from "./components/login/login.component";
import {MainComponent} from "./components/main/main.component";
import {UserComponent} from "./components/user/user.component";
import {ForbiddenComponent} from "./components/forbidden/forbidden.component";
import {ProfileComponent} from "./components/main/profile/profile.component";

const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    pathMatch: 'full',
    component: UserComponent,
    children: [
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: '',
            component: ProfileComponent,
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
