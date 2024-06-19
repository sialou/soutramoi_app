import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { TabsService } from 'src/app/services/tabs.service';

@Component({
  selector: 'app-tabs',
  styleUrls: ['tabs.page.scss'],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" [ngClass]="{hidden: hidden}">
        <ion-tab-button tab="home">
          <ion-icon src="assets/icons/home.svg"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="map">
          <ion-icon src="assets/icons/map.svg"></ion-icon>
        </ion-tab-button>
        <div class="tabs-button-center">
          <button type="button" [routerLink]="['/search']">
            <ion-icon src="assets/icons/search.svg"></ion-icon>
          </button>
        </div>
        <ion-tab-button tab="favorite">
          <ion-icon src="assets/icons/heart.svg"></ion-icon>
        </ion-tab-button>
        <ion-tab-button tab="profile">
          <ion-icon src="assets/icons/account.svg"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
})
export class TabsPage implements OnInit, OnDestroy {
  hidden = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private tabs: TabsService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.tabs.listen().subscribe(s => this.hidden = !s));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
