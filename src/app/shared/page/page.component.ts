import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page',
  styleUrls: ['./page.component.scss'],
  template: `
    <ion-content [fullscreen]="true">
      <div class="page-inner" [style.backgroundColor]="backgroundColor">
        <ng-content></ng-content>
      </div>
    </ion-content>
  `,
})
export class PageComponent {
  @Input() backgroundColor = 'var(--app-color-background)';
}
