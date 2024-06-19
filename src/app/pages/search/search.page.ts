import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements AfterViewInit, OnDestroy {
  loading = false;
  mode = true;
  items: Professional[] = [];
  stack: Professional[] = [
    {
      id: 1,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: 'assets/img/profile.jpg',
      likes: 25,
      rate: 3,
      liked: true,
    },
    {
      id: 2,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: 'assets/img/profile.jpg',
      likes: 105,
      rate: 5,
      liked: false,
    },
    {
      id: 3,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: '',
      likes: 349,
      rate: 2,
      liked: false,
    },
    {
      id: 4,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: 'assets/img/profile.jpg',
      likes: 39,
      rate: 4,
      liked: true,
    },
    {
      id: 5,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: null,
      likes: 9,
      rate: 4,
      liked: true,
    },
    {
      id: 6,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: 'assets/img/profile.jpg',
      likes: 10,
      rate: 4,
      liked: false,
    },
    {
      id: 7,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: 'assets/img/profile.jpg',
      likes: 60,
      rate: 4,
      liked: false,
    },
    {
      id: 8,
      name: 'Juan Perez',
      job: 'Ménuisier',
      location: 'Paris',
      photoUrl: 'assets/img/profile.jpg',
      likes: 7,
      rate: 4,
      liked: true,
    },
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
  ) { }

  ngAfterViewInit() { }

  ionViewDidEnter() {
    this.items = this.stack;
  }

  ionViewDidLeave() {
    this.items = [];
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  navigate(item: Professional) {
    this.router.navigate(['/pro', item.id]);
  }
}
