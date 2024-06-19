import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reviews-comment',
  styleUrls: ['./reviews-comment.component.scss'],
  template: `
    <div class="top">
      <app-avatar [url]="item.photoUrl" [size]="30"></app-avatar>
      <div class="name">{{ item.name }}</div>
    </div>
    <div class="rate">
      <div class="stars">
        <ion-icon *ngFor="let star of stars" [src]="star"></ion-icon>
      </div>
      <div class="date">{{ item.created | dateFormat: 'dd MMM yyyy' }}</div>
    </div>
    <div class="message">{{ item.message }}</div>
  `,
})

export class ReviewsCommentComponent implements OnInit {
  @Input() item: ReviewItem;

  stars: string[] = [];

  ngOnInit() {
    for (let i = 0; i < this.item.rate; i++) {
      this.stars.push('assets/icons/star.svg');
    }

    for (let i = this.item.rate; i < 5; i++) {
      this.stars.push('assets/icons/star-outline.svg');
    }
  }
}
