import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-dialog',
  styleUrls: ['./dialog.component.scss'],
  animations: [
    trigger('AnimContent', [
      transition(
        ':enter',
        [
          style({
            opacity: 0,
            transform: 'scale(1.185)',
          }),
          animate('0.4s ease', style({
            opacity: 1,
            transform: 'scale(1)',
          }))
        ]
      ),
      transition(
        ':leave',
        [
          style({
            transform: 'scale(1)',
            opacity: 1,
          }),
          animate('0.2s ease', style({
            transform: 'scale(0.815)',
            opacity: 0,
          }))
        ]
      )
    ]),
    trigger('AnimBackdrop', [
      transition(
        ':enter',
        [
          style({
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          }),
          animate('0.3s ease-in', style({
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }))
        ]
      ),
      transition(
        ':leave',
        [
          style({
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
          }),
          animate('0.2s ease-out', style({
            backgroundColor: 'rgba(0, 0, 0, 0.0)'
          }))
        ]
      )
    ]),
  ],
  template: `
    <div class="dialog-container" role="document" [@AnimBackdrop] *ngIf="backdropState" (click)="backdropClose($event)">
      <div class="dialog-content" [@AnimContent] *ngIf="contentState" [style.width]="width">
        <div class="dialog-title" *ngIf="title">
          <div class="inner">{{ title }}</div>
        </div>
        <div class="dialog-body">
          <ng-content></ng-content>
        </div>
        <div class="dialog-actions" *ngIf="showConfirm || showCancel">
          <button app-button block class="cancel" (click)="onCancel($event)" *ngIf="showCancel">
            {{ cancelText }}
          </button>
          <button app-button block class="confirm" (click)="onConfirm($event)" *ngIf="showConfirm">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DialogComponent implements OnInit, OnDestroy {
  @Input() title?: string;
  @Input() width?: string | number = 280;
  @Input() backdropDismiss?= true;
  @Input() showConfirm?= true;
  @Input() showCancel?= false;
  @Input() confirmText?= 'Oui';
  @Input() cancelText?= 'Non';

  @Output() oninit = new EventEmitter<DialogComponent>();
  @Output() onconfirm = new EventEmitter<Event>();
  @Output() oncancel = new EventEmitter<Event>();

  backdropState = false;
  contentState = false;

  private listener = new Subject<boolean>();
  private sub = Subscription.EMPTY;
  private element: Element;

  constructor(private el: ElementRef) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    if (this.width && typeof this.width === 'number') {
      this.width = this.width + 'px';
    }

    this.oninit.emit(this);
    document.body.appendChild(this.element);

    this.sub = this.listen().subscribe(state => {
      if (state) {
        this.backdropState = true;
        setTimeout(() => this.contentState = true, 150);
      } else {
        this.contentState = false;
        setTimeout(() => this.backdropState = false, 300);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.element.remove();
  }

  listen() {
    return this.listener.asObservable();
  }

  open() {
    this.listener.next(true);
  }

  close() {
    this.listener.next(false);
  }

  backdropClose(event: Event) {
    const backdrop = this.element.querySelector('.dialog-container');

    if (event.target !== backdrop || !this.backdropDismiss) {
      return;
    }

    this.close();
  }

  onConfirm(event: Event) {
    if (this.onconfirm.observers.length) {
      this.onconfirm.emit(event);
    } else {
      this.close();
    }
  }

  onCancel(event: Event) {
    if (this.oncancel.observers.length) {
      this.oncancel.emit(event);
    } else {
      this.close();
    }
  }
}
