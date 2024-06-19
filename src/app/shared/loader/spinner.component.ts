import { Component, HostBinding, Input, OnInit } from '@angular/core';

type SpinnerType = 'ellipse' | 'bars';

@Component({
  selector: 'app-spinner',
  styleUrls: ['./spinner.component.scss'],
  template: `
    <ng-container *ngIf="type === 'ellipse'">
      <div class="spinner-ellipse">
        <div [style.backgroundColor]="color"></div>
        <div [style.backgroundColor]="color"></div>
        <div [style.backgroundColor]="color"></div>
        <div [style.backgroundColor]="color"></div>
      </div>
    </ng-container>

    <ng-container *ngIf="type === 'bars'">
      <div class="spinner-bars" [style.width]="width + 'px'" [style.height]="height + 'px'">
        <div class="spinner">
          <div [style.backgroundColor]="color"></div>
          <div [style.backgroundColor]="color"></div>
          <div [style.backgroundColor]="color"></div>
          <div [style.backgroundColor]="color"></div>
          <div [style.backgroundColor]="color"></div>
        </div>
      </div>
    </ng-container>
  `,
})
export class SpinnerComponent implements OnInit {
  @Input() color = 'var(--ion-color-primary)';
  @Input() width = 80;
  @Input() height = 20;

  @Input() type: SpinnerType = 'ellipse';

  @HostBinding('style.width') hWidth: string;
  @HostBinding('style.height') hHeight: string;

  ngOnInit() {
    this.hWidth = this.width + 'px';
    this.hHeight = this.height + 'px';
  }
}
