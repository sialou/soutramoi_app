import { Component, EventEmitter, Input, Output } from '@angular/core';

import { PictureUpdaterComponent } from 'src/app/shared/picture-updater/picture-updater.component';

@Component({
  selector: 'profile-picture',
  styleUrls: ['./profile-picture.component.scss'],
  template: `
    <div class="picture-container">
      <app-avatar
        [url]="user.photo_url"
        [size]="140"
        [padding]="8"
        [radius]="15"
        [innerRadius]="10"
        [shadow]="true"
      ></app-avatar>
      <button type="button" (click)="updater.pick('photo')">
        <ion-icon src="assets/icons/camera.svg"></ion-icon> Modifier
      </button>
    </div>

    <app-picture-updater
      (ready)="updater = $event"
      (valueChange)="changeImage($event)"
    ></app-picture-updater>
  `,
})
export class ProfilePictureComponent {
  @Output() valueChange = new EventEmitter<any>();
  @Input() user: User;

  updater: PictureUpdaterComponent;

  changeImage(user: User) {
    this.user = user;
    this.valueChange.emit(user);
  }
}
