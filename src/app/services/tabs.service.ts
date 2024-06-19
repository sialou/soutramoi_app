import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TabsService {
  private state = new Subject<boolean>();

  listen() {
    return this.state.asObservable();
  }

  present() {
    this.state.next(true);
  }

  dissmiss() {
    this.state.next(false);
  }
}
