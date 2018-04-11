import {BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppComponent} from './components/app/app.component';
import {LoginComponent} from './components/login/login.component';
import {UserComponent} from "./components/user/user.component";
import {MainComponent} from "./components/main/main.component";
import {routing} from "./app.routing";
import {FormsModule} from "@angular/forms";
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
import { ProfileComponent } from './components/main/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    MainComponent,
    ForbiddenComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    routing,
    CovalentLayoutModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatSidenavModule,
  ],
  providers: [
    CookieService,
    AuthGuard,
    AuthService,
    AppConfig,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthInterceptor,
      multi: true
    },
    LoginComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
