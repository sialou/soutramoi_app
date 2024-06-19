import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { Swiper, SwiperOptions } from 'swiper';

@Component({
  selector: 'pro-works',
  styleUrls: ['./pro-works.component.scss'],
  template: `
    <div class="inner" *ngIf="items.length > 0">
      <div class="profile-heading">
        Projets & réalisations
        <ng-container *ngIf="gridItems.length > 1">
          <button type="button" class="after" (click)="present()">
            <ion-icon src="assets/icons/arrow-back.svg"></ion-icon>
          </button>
        </ng-container>
      </div>
      <div class="works-content grid-{{gridItems.length}}nth">
        <ng-container *ngFor="let item of gridItems; let i = index">
          <div class="item" [style.background-image]="'url(' + item + ')'" (click)="present(i)"></div>
        </ng-container>
      </div>
      <div class="works-more" *ngIf="gridItems.length > 1">
        <button type="button" (click)="present()">Voir plus</button>
      </div>
    </div>

    <ion-modal #modalWorks [isOpen]="false">
      <ng-template>
        <ion-content>
          <app-navbar [end]="false" [titleCentered]="false">
            <button type="button" slot="start" (click)="dismiss()">
              <ion-icon src="assets/icons/back.svg"></ion-icon>
            </button>
            <div class="profile-user" slot="center">
              <app-avatar [url]="profile.photoUrl" [size]="35"></app-avatar>
              <div class="info">
                <h4 slot="center">{{ profile.name }}</h4>
                <h5 slot="center">{{ profile.job }}</h5>
              </div>
            </div>
          </app-navbar>
          <div class="slider-content">
            <swiper [config]="swiperConfig" (swiper)="swiper = $event">
              <ng-template swiperSlide *ngFor="let item of slideItems; let i = index">
                <div class="slide-item">
                  <img [src]="item" [alt]="'Work ' + (i + 1)">
                </div>
              </ng-template>
            </swiper>
          </div>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
})
export class ProWorksComponent implements OnInit, OnDestroy {
  @ViewChild('modalWorks') modal: IonModal;
  @Input() profile: Professional;

  swiper: Swiper;
  items: string[] = [];
  gridItems: string[] = [];
  slideItems: string[] = [];
  activeSlide = 0;
  open = false;

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    initialSlide: 0,
    enabled: false,
    autoplay: false,
    loop: false,
  };

  constructor() { }

  ngOnInit() {
    this.items = [
      'assets/img/work1.jpeg',
      'assets/img/cover.jpg',
      'assets/img/cover.jpg',
      'assets/img/work1.jpeg',
      'assets/img/work1.jpeg',
      'assets/img/cover.jpg',
      'assets/img/work1.jpeg',
      'assets/img/cover.jpg',
      'assets/img/work1.jpeg',
      'assets/img/cover.jpg',
    ];
    this.gridItems = this.items.slice(0, 9);
  }

  ngOnDestroy() { }

  onDidEnter() {
    this.slideItems = this.items;
    this.swiper.enable();
    this.swiper.slideTo(this.activeSlide);
  }

  onDidLeave() {
    this.swiper.disable();
    this.slideItems = [];
  }

  async present(slide = 0) {
    this.activeSlide = slide;
    await this.modal.present();
    this.open = true;

    return this.onDidEnter();
  }

  async dismiss() {
    await this.modal.dismiss();
    this.open = false;

    return this.onDidLeave();
  }
}
