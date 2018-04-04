import {BrowserModule} from '@angular/platform-browser';
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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    routing
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
