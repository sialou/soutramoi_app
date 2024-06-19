import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IonModal, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pro-reviews-form',
  styleUrls: ['./pro-reviews-form.component.scss'],
  template: `
    <div class="rate-stars">
      <button
        type="button"
        *ngFor="let star of stars; let i = index"
        [class.active]="rate >= i + 1"
        (click)="handle(i + 1)"
      >
        <ion-icon [src]="star"></ion-icon>
      </button>
    </div>
    <div class="rate-actions">
      <button type="button" (click)="present()">
        {{rate === 0 ? 'Rediger un avis' : 'Modifier mon avis'}}
      </button>
      <!-- <button type="button" class="cancel" (click)="cancel()" *ngIf="rate > 0">Annuler</button> -->
    </div>

    <ion-modal
      #modal
      [isOpen]="false"
      [breakpoints]="[0.6, 0.7, 0.8]"
      [initialBreakpoint]="0.6"
      [backdropDismiss]="false"
      [handle]="!loading"
    >
      <ng-template>
        <ion-content>
          <div class="review-modal">
            <div class="review-loader" *ngIf="loading">
              <app-spinner></app-spinner>
              <div class="message">Envoi en cours…</div>
            </div>
            <div class="review-user">
              <div class="picture">
                <img src="assets/img/profile.jpg" alt="Flora Kouassi">
              </div>
              <div class="info">
                <div class="name">{{profile.name}}</div>
                <div class="job">{{profile.job}}</div>
              </div>
            </div>
            <div class="review-message">
              Les avis sont publics et incluent les informations de compte.
            </div>
            <div class="review-stars">
              <button
                type="button"
                *ngFor="let star of stars; let i = index"
                [class.active]="rate >= i + 1"
                (click)="handle(i + 1)"
              >
                <ion-icon [src]="star"></ion-icon>
              </button>
            </div>
            <div class="review-form">
              <textarea
                maxlength="500"
                placeholder="Dites ce que vous pensez de ce professionnel (facultatif)"
                [formControl]="reviewInput"
              ></textarea>
              <div class="input-footer">
                <div>Avis public</div>
                <div>{{ reviewInput.value.length }}/500</div>
              </div>
            </div>
            <div class="review-actions">
              <button type="button" class="cancel" (click)="cancel()">Annuler</button>
              <button type="button" class="submit" (click)="submit()" [disabled]="rate === 0">Envoyer</button>
            </div>
          </div>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
})
export class ProReviewsFormComponent implements OnInit {
  @ViewChild('modal') modal: IonModal;

  @Output() reviewChange = new EventEmitter<ReviewItem>();
  @Input() profile: Professional;

  maxLength = 500;
  loading = false;
  rate = 0;
  stars: string[] = [];
  reviewInput: FormControl;

  private subscriptions: Subscription[] = [];

  constructor(private platform: Platform) { }

  ngOnInit() {
    const review: ReviewItem = { rate: 0, message: '' };

    this.stars = this.getStars(review.rate);
    this.reviewInput = new FormControl(review.message, [
      Validators.maxLength(this.maxLength),
    ]);
  }

  present() {
    this.modal.present();

    const sub = this.platform.backButton.subscribeWithPriority(10, () => {
      if (!this.loading && this.modal.isOpen) {
        this.cancel();
      }
    });

    this.subscriptions.push(sub);
  }

  dismiss() {
    this.modal.dismiss();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  handle(note: RateValue | number) {
    this.rate = note;
    this.stars = this.getStars(note);

    if (!this.modal.isOpen) {
      this.modal.present();
    }
  }

  cancel() {
    this.rate = 0;
    this.stars = this.getStars(this.rate);
    this.reviewInput.setValue('');
    this.dismiss();
  }

  submit() {
    this.loading = true;
    const message: string = this.reviewInput.value;
    const review: ReviewItem = { message, rate: this.rate };

    setTimeout(() => {
      this.loading = false;
      this.reviewChange.emit(review);
      this.dismiss();
    }, 2000);
  }

  private getStars(rate: number) {
    const stars: string[] = [];

    for (let i = 0; i < rate; i++) {
      stars.push('assets/icons/star.svg');
    }

    for (let i = rate; i < 5; i++) {
      stars.push('assets/icons/star-outline.svg');
    }

    return stars;
  }
}
