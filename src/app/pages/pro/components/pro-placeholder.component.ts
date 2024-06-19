import { Component } from '@angular/core';

@Component({
  selector: 'pro-placeholder',
  styleUrls: ['./pro-placeholder.component.scss'],
  template: `
    <div class="header">
      <app-placeholder class="cover"></app-placeholder>
      <div class="info">
        <div class="picture">
          <app-placeholder></app-placeholder>
        </div>
        <div class="actions">
          <app-placeholder></app-placeholder>
          <app-placeholder></app-placeholder>
        </div>
      </div>
    </div>
    <hr>
    <div class="badge">
      <app-placeholder class="icon"></app-placeholder>
      <div class="info">
        <app-placeholder class="job"></app-placeholder>
        <app-placeholder class="location"></app-placeholder>
      </div>
    </div>
    <div class="description">
      <app-placeholder></app-placeholder>
      <app-placeholder></app-placeholder>
      <app-placeholder></app-placeholder>
      <app-placeholder></app-placeholder>
      <app-placeholder></app-placeholder>
    </div>
  `,
})
export class ProPlaceholderComponent { }
