import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-professional-card',
  styleUrls: ['./professional-card.component.scss'],
  template: `
    <div class="inner" [ngClass]="{columned: columned}" (click)="open($event)">
      <div class="media">
        <app-avatar [url]="item.photoUrl" [size]="columned ? 35 : 80" [radius]="columned ? '50%' : 7"></app-avatar>
        <div class="cover" *ngIf="columned && !item.coverUrl"></div>
        <div class="cover" *ngIf="columned && item.coverUrl" [style.background-image]="'url(' + item.coverUrl + ')'"></div>
      </div>
      <div class="info">
        <div class="job">{{ item.job }}</div>
        <div class="doc">
          <div class="name">{{ item.name }}</div>
          <div class="location">{{ item.location }}</div>
        </div>
        <div class="stats">
          <div class="stars">
            <ion-icon *ngFor="let star of stars" [src]="star"></ion-icon>
          </div>
          <div class="like" [class.liked]="item.liked" (click)="like()">
            <div class="like-counter">{{ item.likes }}</div>
            <button type="button" class="like-button">
              <ion-icon [src]="item.liked ? 'assets/icons/heart.svg' : 'assets/icons/heart-outline.svg'"></ion-icon>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProfessionalCardComponent implements OnInit {
  @Input() item: Professional;
  @Input() columned?= false;

  @Output() external = new EventEmitter<Professional>();

  stars: string[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.stars = this.getStars(this.item.rate);
  }

  open(event: any) {
    if ((event.target as Element).classList.contains('like')) {
      return;
    }

    if (this.external.observers.length) {
      this.external.emit(this.item);
    } else {
      this.router.navigate(['/pro', this.item.id]);
    }
  }

  like() {
    this.item.liked = !this.item.liked;
    this.item.likes += this.item.liked ? 1 : -1;
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
