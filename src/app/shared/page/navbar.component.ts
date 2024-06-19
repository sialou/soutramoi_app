import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  styleUrls: ['./navbar.component.scss'],
  template: `
    <div class="navbar-inner">
      <div class="nav-action" *ngIf="start">
        <ng-content select="[slot=start]"></ng-content>
      </div>
      <div class="nav-center" [ngClass]="{centered: titleCentered}" *ngIf="center">
        <ng-content select="[slot=center]"></ng-content>
      </div>
      <div class="nav-action right" *ngIf="end">
        <ng-content select="[slot=end]"></ng-content>
      </div>
    </div>
  `,
})

export class NavbarComponent implements OnInit {
  @Input() start = true;
  @Input() center = true;
  @Input() end = true;

  @Input() shadow = false;
  @Input() darkContent = false;
  @Input() titleCentered = true;

  @HostBinding('class.shadow') hShadow = false;
  @HostBinding('class.dark-content') hDarkContent = false;

  ngOnInit() {
    this.hShadow = this.shadow;
    this.hDarkContent = this.darkContent;
  }
}
