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
import {DataService} from "./services/data/data.service";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import { AdminChairmanComponent } from './components/admin/admin-chairman/admin-chairman.component';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import { NewsComponent } from './components/main/news/news.component';
import { HolderListComponent } from './components/main/holder-list/holder-list.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import {MatDialogModule} from '@angular/material';
import { ApartmentListComponent } from './components/main/apartment-list/apartment-list.component';

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
    ApartmentListComponent
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
    MatDialogModule
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
    LoginComponent,
    DataService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
      DeleteDialogComponent
  ]

})
export class AppModule { }
