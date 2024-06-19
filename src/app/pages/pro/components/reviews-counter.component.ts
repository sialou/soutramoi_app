import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'reviews-counter',
  styleUrls: ['./reviews-counter.component.scss'],
  template: `
    <div class="counter">
      <div class="rate">{{ review.rate }}</div>
      <div class="stars">
        <ion-icon *ngFor="let star of stars" [src]="star"></ion-icon>
      </div>
      <div class="total">{{ review.total }}</div>
    </div>
    <div class="progress">
      <div class="item" *ngFor="let nb of review.rank; let i = index">
        <div class="value">{{ 5 - i }}</div>
        <div class="bar">
          <div [style.width]="progressWidth(nb)"></div>
        </div>
      </div>
    </div>
  `,
})
export class ReviewsCounterComponent implements OnInit {
  review = {
    total: 21,
    rank: [13, 5, 2, 1, 0],
    rate: 4.3,
  };

  stars: string[] = [];

  constructor() { }

  ngOnInit() {
    const rate = Math.floor(this.review.rate);

    for (let i = 0; i < rate; i++) {
      this.stars.push('assets/icons/star.svg');
    }

    for (let i = rate; i < 5; i++) {
      this.stars.push('assets/icons/star-outline.svg');
    }
  }

  progressWidth(nb: number) {
    const value = (nb * 100) / this.review.total;
    return `${value}%`;
  }
}
