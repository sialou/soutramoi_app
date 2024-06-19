import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-item',
  styleUrls: ['./list-item.component.scss'],
  template: `
    <div class="inner" matRipple [matRippleColor]="'rgba(254,105,2,0.2)'">
      <div class="media" *ngIf="ionIcon || svgIcon">
        <ion-icon *ngIf="ionIcon" [name]="ionIcon"></ion-icon>
        <ion-icon *ngIf="svgIcon" src="assets/icons/{{svgIcon}}.svg"></ion-icon>
      </div>
      <div class="content">
        <h3 class="{{titleSize}}">{{ title }}</h3>
        <span class="footer" *ngIf="subTitle">{{ subTitle }}</span>
      </div>
      <div class="after">
        <ion-icon class="link" src="assets/icons/forward.svg" *ngIf="type === 'link'"></ion-icon>
        <div *ngIf="type !== 'link'">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
})
export class ListItemComponent {
  @Input() title: string;
  @Input() titleSize: 'normal' | 'small' = 'normal';
  @Input() type: 'link' | 'item' = 'link';
  @Input() subTitle: string = null;
  @Input() ionIcon: string = null;
  @Input() svgIcon: string = null;
}
