import { Component } from '@angular/core';

@Component({
  selector: 'body',
  template: `<div class="container"><router-outlet></router-outlet></div>`
})
export class AppComponent {
  title = 'app';
}
