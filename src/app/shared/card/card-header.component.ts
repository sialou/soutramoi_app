import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-header',
  styleUrls: ['./card-header.component.scss'],
  template: `
    <div class="card-header-media">
      <ion-icon [src]="icon"></ion-icon>
    </div>
    <div class="card-header-title">
      {{title}} <small *ngIf="suffix">{{suffix}}</small>
      <div class="subtitle" *ngIf="subtitle">{{subtitle}}</div>
    </div>
  `,
})
export class CardHeaderComponent {
  @Input() title: string;
  @Input() suffix: string;
  @Input() subtitle: string;
  @Input() icon = 'assets/icon/link.svg';
}
