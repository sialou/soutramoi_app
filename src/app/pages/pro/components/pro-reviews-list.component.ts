import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { StatusBar, Style } from '@capacitor/status-bar';

type FilterRule = '*' | '>' | '<' | '=5' | '=4' | '=3' | '=2' | '=1';

@Component({
  selector: 'pro-reviews-list',
  styleUrls: ['./pro-reviews-list.component.scss'],
  template: `
    <ng-container *ngIf="items.length">
      <div class="profile-heading">
        Notes et avis
        <button type="button" class="after" (click)="present()">
          <ion-icon src="assets/icons/arrow-back.svg"></ion-icon>
        </button>
      </div>
      <reviews-counter></reviews-counter>
      <hr class="divider">
      <div class="reviews-comments">
        <reviews-comment *ngFor="let item of items.slice(0, limit);" [item]="item"></reviews-comment>
      </div>
      <div class="reviews-more" *ngIf="items.length > limit">
        <button type="button" (click)="present()">Afficher plus d'avis</button>
      </div>
    </ng-container>

    <ion-modal #modalComments [isOpen]="false">
      <ng-template>
        <app-page [backgroundColor]="'#FFFFFF'">
          <app-navbar [end]="false" [darkContent]="true" [shadow]="true" [titleCentered]="false">
            <button type="button" slot="start" (click)="dismiss()">
              <ion-icon src="assets/icons/back.svg"></ion-icon>
            </button>
            <div class="profile-user" slot="center">
              <app-avatar [url]="profile.photoUrl" [size]="35" [radius]="7"></app-avatar>
              <div class="info">
                <h4 slot="center">{{ profile.name }}</h4>
                <h5 slot="center">{{ profile.job }}</h5>
              </div>
            </div>
          </app-navbar>
          <app-content [shadowScrolling]="false">
            <div class="content-filter">
              <ng-container *ngFor="let item of filters">
                <button
                  type="button"
                  [ngClass]="{active: item.rule === filterRule}"
                  [disabled]="loading"
                  (click)="filter(item.rule)"
                >{{ item.label }}</button>
              </ng-container>
            </div>
            <div class="content-body">
              <div class="reviews-comments" *ngIf="!loading && modalItems.length > 0">
                <reviews-comment *ngFor="let item of modalItems" [item]="item"></reviews-comment>
              </div>
              <div class="reviews-loader" *ngIf="loading">
                <app-spinner [color]="'rgba(var(--ion-color-primary-rgb), 0.8)'" [width]="100"></app-spinner>
              </div>
            </div>
          </app-content>
        </app-page>
      </ng-template>
    </ion-modal>
  `
})
export class ProReviewsListComponent implements OnInit {
  @ViewChild('modalComments') modal: IonModal;
  @Input() profile: Professional;

  readonly limit = 3;
  readonly perpage = 10;

  loading = false;
  filterRule: FilterRule = '*';
  filters: { rule: FilterRule; label: string }[] = [];

  modalItems: ReviewItem[] = [];
  items: ReviewItem[] = [
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2022-01-13 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 4,
    },
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2021-09-25 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 5,
    },
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2021-08-18 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 1,
    },
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2021-08-18 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 1,
    },
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2021-08-18 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 1,
    },
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2021-08-18 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 1,
    },
    {
      name: 'Flora Kouassi',
      photoUrl: 'assets/img/profile.jpg',
      created: '2021-08-18 12:36:20',
      message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis obcaecati itaque ad iste…',
      rate: 1,
    }
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private platform: Platform,
  ) {
    this.filters = [
      { rule: '*', label: 'Tous' },
      { rule: '>', label: 'Positifs' },
      { rule: '<', label: 'Négatifs' },
      { rule: '=5', label: '5 étoiles' },
      { rule: '=4', label: '4 étoiles' },
      { rule: '=3', label: '3 étoiles' },
      { rule: '=2', label: '2 étoiles' },
      { rule: '=1', label: '1 étoile' },
    ];
  }

  ngOnInit() { }

  onDidEnter() {
    this.loading = true;

    if (this.platform.is('hybrid')) {
      StatusBar.setStyle({ style: Style.Light });
    }

    setTimeout(() => {
      this.modalItems = this.items;
      this.loading = false;
    }, 1500);

    const sub = this.platform.backButton.subscribeWithPriority(11, () => {
      if (this.modal.isOpen) {
        this.dismiss();
      }
    });

    this.subscriptions.push(sub);
  }

  onDidLeave() {
    if (this.platform.is('hybrid')) {
      StatusBar.setStyle({ style: Style.Dark });
    }

    this.modalItems = [];
    this.loading = false;
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async present() {
    await this.modal.present();
    return this.onDidEnter();
  }

  async dismiss() {
    await this.modal.dismiss();
    return this.onDidLeave();
  }

  filter(rule: FilterRule) {
    this.filterRule = rule;
  }
}
