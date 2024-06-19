import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

import { fadeTransition } from 'src/app/animations';

type ItemState = 'initial' | 'edit' | 'loading' | 'done' | 'error';

interface ItemSelectOption {
  name: string;
  value: any;
}

@Component({
  selector: 'profile-card-item',
  animations: [fadeTransition],
  styleUrls: ['./profile-card-item.component.scss'],
  template: `
    <div class="inner">
      <div class="info" @FadeTransition *ngIf="state.value !== 'edit'">
        <div class="text">
          <div class="label" *ngIf="label">{{label}}</div>
          <div class="name" *ngIf="name">
            {{ inputType === 'email' ? name : name | capitalize }}
          </div>
        </div>
        <div class="actions">
          <button @FadeTransition type="button" class="action" (click)="edit()" *ngIf="state.value === 'initial'">
            <ion-icon src="assets/icons/pencil.svg"></ion-icon>
          </button>
          <div class="action loader" @FadeTransition *ngIf="state.value === 'loading'"></div>
          <div class="action done" @FadeTransition *ngIf="state.value === 'done'">
            <ion-icon src="assets/icons/check-circle.svg"></ion-icon>
          </div>
          <div class="action error" @FadeTransition *ngIf="state.value === 'error'">
            <ion-icon src="assets/icons/cancel.svg"></ion-icon>
          </div>
        </div>
      </div>
      <div class="input" @FadeTransition *ngIf="state.value === 'edit'">
        <ng-container *ngIf="inputType !== 'select'">
          <input #inputElm [type]="inputType || 'text'" [placeholder]="label || 'Saisir une valeur'" [formControl]="input">
        </ng-container>
        <ng-container *ngIf="inputType === 'select'">
          <select [name]="slug" [formControl]="input">
            <option [ngValue]="null" disabled>
              {{label || 'Sélectionner une valeur'}}
            </option>
            <option *ngFor="let item of inputSelectOptions" [ngValue]="item.value">
              {{item.name}}
            </option>
          </select>
        </ng-container>
        <button type="button" (click)="valueChange.emit(input.value)" [disabled]="input.value === value || !input.valid">
          <ion-icon src="assets/icons/check.svg"></ion-icon>
        </button>
      </div>
    </div>
  `,
})
export class ProfileCardItemComponent implements OnInit, OnDestroy {
  @ViewChild('inputElm') inputElm: { nativeElement: HTMLInputElement };

  @Output() listen = new EventEmitter<ItemState>();
  @Output() valueChange = new EventEmitter<any>();

  @Input() value: any = null;
  @Input() name?: string = null;
  @Input() label?: string;
  @Input() input?: FormControl;
  @Input() inputType?: string;
  @Input() inputMode?: string;
  @Input() inputPattern?: string;
  @Input() inputMaxLength?: number;
  @Input() inputMinLength?: number;
  @Input() inputSelectOptions?: ItemSelectOption[];
  @Input() inputValidators?: ValidatorFn[] = [];
  @Input() submit?: (slug: string, value: any) => Promise<any>;
  @Input() slug?: string;

  state = new BehaviorSubject<ItemState>('initial');

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    if (this.inputType === 'select' && !this.inputSelectOptions) {
      throw new Error('inputSelectOptions is required for select input');
    }

    if (this.submit && !this.slug) {
      throw new Error('slug is required when submit is defined');
    }

    this.name = this.resolveName(this.value);

    if (!this.input) {
      this.input = new FormControl(this.value, this.inputValidators || []);
    } else {
      this.input.setValue(this.value);

      if (this.inputValidators.length > 0) {
        this.input.setValidators(this.inputValidators);
      }
    }

    const sub = this.state.subscribe(state => this.listen.emit(state));
    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  edit() {
    this.state.next('edit');
    setTimeout(() => this.bindInput(), 200);
  }

  done(value: any) {
    this.state.next('done');
    this.value = value;
    this.name = this.resolveName(value);
  }

  private bindInput() {
    if (!this.inputElm) {
      return;
    }

    const inputField = this.inputElm.nativeElement;

    if (this.inputType !== 'select') {
      inputField.focus();
    }

    if (this.inputMode) {
      inputField.setAttribute('inputmode', this.inputMode);
    }

    if (this.inputPattern) {
      inputField.setAttribute('pattern', this.inputPattern);
    }

    if (this.inputMaxLength) {
      inputField.setAttribute('maxlength', this.inputMaxLength.toString());
    }

    if (this.inputMinLength) {
      inputField.setAttribute('minlength', this.inputMinLength.toString());
    }
  }

  private resolveName(value: any) {
    if (this.inputType === 'select') {
      const item = this.inputSelectOptions.find(i => i.value === value);
      return item ? item.name : null;
    } else {
      return value;
    }
  }
}
