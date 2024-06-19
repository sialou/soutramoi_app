import { Component, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-loader',
  styleUrls: ['./loader.component.scss'],
  template: `
    <div class="loader-container" *ngIf="state">
      <div class="loader-content">
        <app-spinner-infinity [secondaryColor]="'rgba(var(--ion-color-primary-rgb),0.15)'"></app-spinner-infinity>
        <div class="loader-message">{{ message }}</div>
      </div>
    </div>
  `
})
export class LoaderComponent implements AfterViewInit, OnDestroy {
  state = false;
  message: string;

  private subscription: Subscription;
  private element: Element;

  constructor(
    private elm: ElementRef,
    private service: LoaderService,
  ) {
    this.element = this.elm.nativeElement;
    this.message = this.service.getMessage();
  }

  ngAfterViewInit() {
    this.subscription = this.service.listen().subscribe(value => {
      this.message = this.service.getMessage();

      if (value) {
        this.state = true;

        setTimeout(() => {
          this.element.querySelector('.loader-content').classList.remove('close');
          this.element.querySelector('.loader-content').classList.add('open');
        }, 50);
      } else {
        this.element.querySelector('.loader-content').classList.add('close');
        this.element.querySelector('.loader-content').classList.remove('open');
        setTimeout(() => this.state = false, 400);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
