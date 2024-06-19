import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, from, Subscription } from 'rxjs';
import Fuse from 'fuse.js';

import { fadeTransition } from 'src/app/animations';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { NetworkService, NetworkState } from 'src/app/services/network.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'tab-favorite',
  templateUrl: 'favorite.page.html',
  styleUrls: ['favorite.page.scss'],
  animations: [fadeTransition],
})
export class FavoritePage {
  items: Professional[] = [];
  stack: Professional[] = [];

  searchPattern = '';
  state = new BehaviorSubject<PageState>('initial');
  defaultFailMessage = 'Une erreur est survenue lors de la récupération des données.';
  failMessage = this.defaultFailMessage;
  fuse: Fuse<Professional>;
  limit = 10;
  logged = false;

  readonly perpage = 10;

  private netSub = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    public router: Router,
    private http: HttpClient,
    private app: AppService,
    private auth: AuthService,
    private network: NetworkService,
  ) {
    this.fuse = new Fuse<Professional>(this.stack, {
      keys: ['name', 'job', 'location'],
    });
  }

  async ionViewDidEnter() {
    this.logged = await this.auth.isLogged();

    if (this.logged) {
      this.state.next('loading');

      if (this.network.is('online')) {
        this.fetchData();
      } else {
        this.state.next('offline');

        this.netSub = this.network.listen().subscribe(state => {
          if (state === NetworkState.on) {
            this.fetchData();
          }
        });
      }
    }
  }

  ionViewDidLeave() {
    this.netSub.unsubscribe();
    this.subscriptions.forEach(i => i.unsubscribe());
  }

  onSearch(pattern: string) {
    if (pattern.length === 0) {
      this.searchPattern = '';
      this.items = [...this.stack].slice(0, this.limit);
      return;
    }

    this.searchPattern = pattern;

    const items = this.fuse.search(pattern).map(i => i.item);
    this.items = items.slice(0, this.limit);
  }

  showMore() { }

  goToProfile() {
    this.router.navigate(['/tabs/profile']);
  }

  private async fetchData() {
    const id_token = await this.auth.getIdToken();
    const body: any = { id_token };

    const sub = this.http.post<Professional[]>('/me/favorites', body).subscribe({
      next: items => {
        if (items.length > 0) {
          this.stack = items;
          this.items = [...this.stack].slice(0, this.limit);
        }

        this.state.next('ready');
      },
      error: err => {
        this.failMessage = this.app.handlingError(err, false);
        this.state.next('failed');
      },
      complete: () => {
        sub.unsubscribe();
        this.netSub.unsubscribe();
      },
    });

    this.subscriptions.push(sub);
  }
}
