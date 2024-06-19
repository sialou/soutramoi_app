import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ConnectionStatus, Network } from '@capacitor/network';

export enum NetworkState { on, off }

@Injectable({
  providedIn: 'root'
})
export class NetworkService {
  private status: Subject<NetworkState>;
  private state = NetworkState.off;

  constructor() {
    this.status = new Subject();
    this.init();
  }

  /**
   * Check network state
   */
  async is(state: 'online' | 'offline') {
    const status = await Network.getStatus();
    const currentState = status.connected ? NetworkState.on : NetworkState.off;
    const checker = state === 'online' ? NetworkState.on : NetworkState.off;

    return currentState === checker;
  }

  /**
   * Listen network state
   */
  listen() {
    return this.status.asObservable();
  }

  /**
   * Get network state
   */
  getState() {
    return this.state;
  }

  private async init() {
    const status = await Network.getStatus();

    this.handle(status);
    Network.addListener('networkStatusChange', s => this.handle(s));
  }

  private handle(status: ConnectionStatus) {
    this.state = status.connected ? NetworkState.on : NetworkState.off;
    this.status.next(this.state);
  }
}
