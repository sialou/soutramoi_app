import { Component, OnInit, OnDestroy, Output, EventEmitter, Input, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { pageTransition } from 'src/app/animations';

@Component({
  selector: 'app-modal',
  animations: [pageTransition],
  styles: [`
    :host {
      display: block;
    }

    .modal-content {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: white;
      z-index: var(--app-modal-zindex);
    }
  `],
  template: `
    <div class="modal-content" [@pageTransition] *ngIf="state">
      <ng-content></ng-content>
    </div>
  `
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string;

  @Output() oninit = new EventEmitter<ModalComponent>();
  @Output() onopen = new EventEmitter<void>();
  @Output() onclose = new EventEmitter<void>();

  readonly observable: Subject<boolean> = new Subject();
  state = false;

  private subscriptions: Subscription[] = [];
  private element: Element;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

  ngOnInit() {
    if (!this.id) {
      console.error('Modal must have an id.');
      return;
    }

    this.oninit.emit(this);

    document.body.appendChild(this.element);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  stateChange() {
    return this.observable.asObservable();
  }

  open() {
    this.state = true;
    this.observable.next(this.state);
    this.onopen.emit();
  }

  close() {
    this.state = false;
    this.observable.next(this.state);
    this.onclose.emit();
  }
}
