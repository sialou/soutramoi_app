import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';

import { AlertService } from 'src/app/services/alert.service';

interface ServiceItem {
  name: string;
  control: FormControl;
}

@Component({
  selector: 'profile-pro-services',
  styleUrls: ['./profile-pro-services.component.scss'],
  template: `
    <div class="services-list">
      <app-input floatLabel *ngFor="let item of fields; let i = index">
        <input
          type="text"
          [id]="'item' + (i+1)"
          (blur)="onBlur(item)"
          [formControl]="item.control"
          placeholder="Entrez un service"
          required
        >
        <label [for]="'item' + (i+1)">Service {{i + 1}}</label>
        <button type="button" class="remove" [disabled]="i === minItem - 1" (click)="remove(item.name)">
          <ion-icon src="assets/icons/delete.svg"></ion-icon>
        </button>
      </app-input>
    </div>
    <div class="services-add">
      <button
        app-button
        type="button"
        color="secondary"
        (click)="add()"
        [disabled]="fields.length === maxItem"
      >
        <ion-icon src="assets/icons/cancel.svg"></ion-icon> Ajouter un service
      </button>
    </div>
  `,
})
export class ProfileProServicesComponent implements OnInit {
  @Output() valueChange = new EventEmitter<string[]>();
  @Input() payload: ProfessionalData;
  @Input() maxItem = 10;
  @Input() minItem = 1;

  submited = false;
  fields: ServiceItem[] = [];
  items: string[] = [];
  state = new BehaviorSubject<string[]>([]);

  readonly validators = [
    Validators.required,
    Validators.minLength(3),
  ];

  private subscriptions: Subscription[] = [];

  constructor(
    private alert: AlertService,
  ) { }

  ngOnInit() {
    if (this.payload.services.length) {
      this.items = this.payload.services;
      this.items.forEach(i => this.add(i));
    } else {
      this.add();
    }

    const sub = this.state.asObservable().subscribe(items => {
      this.valueChange.emit(items);
    });

    this.subscriptions.push(sub);
  }

  add(value = null) {
    if (this.fields.length === this.maxItem) {
      return;
    }

    for (const item of this.fields) {
      if (!item.control.valid) {
        this.alert.present(`Le service "${item.control.value}" n'est pas valide.`);
        return;
      }
    }

    const name = `service-${this.fields.length + 1}`;
    const control = new FormControl(value, this.validators);

    this.fields.push({ name, control });
  }

  remove(name: string) {
    if (this.fields.length === this.minItem) {
      return;
    }

    const items: string[] = [];

    this.fields = this.fields.filter(s => s.name !== name);
    this.fields.forEach(i => items.push(i.control.value));
    this.state.next(items);
  }

  onBlur(field: ServiceItem) {
    if ((field.control.value as string).length === 0) {
      this.remove(field.control.value);
      return;
    }

    if (!field.control.valid) {
      this.alert.present('Le service doit contenir au moins 3 caractères');
      return;
    }

    const items = this.state.value;

    items.push(field.control.value);
    this.state.next(items);
  }

  reset() {
    this.fields = [];
    this.add();
  }
}
