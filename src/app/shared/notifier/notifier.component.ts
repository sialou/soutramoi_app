import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-notifier',
  styleUrls: ['./notifier.component.scss'],
  template: `
    <div class="notifier-container">
      <div class="notifier-media">
        <div class="inner">
          <svg-asset src="img/notifier-shape.svg" color="rgba(var(--ion-color-primary-rgb), 0.08)" [width]="100" class="shape"></svg-asset>
          <svg-asset [src]="icon" color="var(--ion-color-primary)" [width]="62" class="icon"></svg-asset>
        </div>
      </div>
      <div class="notifier-content">
        <div class="notifier-title">{{ title }}</div>
        <div class="notifier-message">{{ message }}</div>
      </div>
      <div class="notifier-actions" *ngIf="withAction">
        <button type="button" (click)="action.emit($event)">{{actionText}}</button>
      </div>
    </div>
  `,
})
export class NotifierComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() icon = 'icons/caution.svg';
  @Input() actionText = 'Réessayer';

  @Output() action = new EventEmitter<any>();

  withAction = true;

  ngOnInit() {
    this.withAction = this.action.observed;
  }
}
