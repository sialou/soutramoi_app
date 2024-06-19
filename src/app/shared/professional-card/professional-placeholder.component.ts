import { Component } from '@angular/core';

@Component({
  selector: 'app-professional-placeholder',
  styleUrls: ['./professional-placeholder.component.scss'],
  template: `
    <div class="inner">
      <app-placeholder class="picture"></app-placeholder>
      <div class="info">
        <app-placeholder class="job"></app-placeholder>
        <div class="bottom">
          <app-placeholder class="name"></app-placeholder>
          <app-placeholder class="location"></app-placeholder>
          <app-placeholder class="stars"></app-placeholder>
        </div>
      </div>
    </div>
    <app-placeholder class="like"></app-placeholder>
  `,
})
export class ProfessionalPlaceholderComponent { }
