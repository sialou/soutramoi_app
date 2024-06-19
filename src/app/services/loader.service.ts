import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private message = 'Chargement...';
  private state = false;
  private status = new Subject<boolean>();

  constructor() {
    this.status = new Subject();
  }

  get loading(): boolean {
    return this.state;
  }

  set loading(value) {
    this.state = value;
    this.status.next(value);
  }

  listen() {
    return this.status.asObservable();
  }

  getMessage(): string {
    return this.message;
  }

  setMessage(message: string): void {
    this.message = message;
    this.status.next(this.state);
  }

  async present(message?: string) {
    this.message = message ? message : this.message;
    this.loading = true;
  }

  async dismiss() {
    this.loading = false;
  }
}
