import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { css } from '@emotion/css';

import { AlertService } from 'src/app/services/alert.service';
import { NetworkService } from 'src/app/services/network.service';
import { PictureUpdaterComponent } from 'src/app/shared/picture-updater/picture-updater.component';

@Component({
  selector: 'profile-pro-images',
  styleUrls: ['./profile-pro-images.component.scss'],
  template: `
    <div class="card-images-cover" [class]="styles.cover">
      <button type="button" class="with-text" (click)="pickImage('cover')">
        <ion-icon src="assets/icons/camera.svg"></ion-icon> Choisir une image de converture
      </button>
    </div>
    <div class="card-images-photo-container">
      <div class="card-images-photo" [class]="styles.photo">
        <button type="button" (click)="pickImage('photo')">
          <ion-icon src="assets/icons/camera.svg"></ion-icon>
        </button>
      </div>
    </div>

    <app-picture-updater
      (ready)="updater = $event"
      (valueChange)="changeImage($event)"
    ></app-picture-updater>
  `,
})
export class ProfileProImagesComponent implements OnChanges {
  @Output() valueChange = new EventEmitter<User>();
  @Input() user: User;

  updater: PictureUpdaterComponent;

  styles = {
    cover: css``,
    photo: css``,
  };

  constructor(
    private network: NetworkService,
    private alert: AlertService,
  ) { }

  async ngOnChanges() {
    if (this.user && this.updater) {
      this.updater.idToken = this.user.id_token;
    }

    if (this.user) {
      this.styles = Object.assign(this.styles, {
        cover: css`
          background-image: url(${this.user.cover_url});
        `,
        photo: css`
          background-image: url(${this.user.photo_url});
        `,
      });
    }
  }

  pickImage(type) {
    if (this.network.is('offline')) {
      this.alert.present('Veuillez vérifier votre connexion internet.');
      return;
    }

    this.updater.pick(type);
  }

  changeImage(user: User) {
    const slug = this.updater.type;

    this.styles[slug] = css`
      background-image: url(${user[slug + '_url']});
    `;

    this.valueChange.emit(user);
  }
}
