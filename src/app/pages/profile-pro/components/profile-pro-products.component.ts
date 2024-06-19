import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'profile-pro-products',
  styleUrls: ['./profile-pro-products.component.scss'],
  template: `
    <h4 class="products-title">Vos produits <small>({{items.length}}/{{maxItem}})</small></h4>
    <div class="products-list" *ngIf="items.length > 0">
      <div class="product-item" *ngFor="let item of items">
        <div class="title">{{item}}</div>
        <button type="button" (click)="remove(item)">
          <ion-icon src="assets/icons/close.svg"></ion-icon>
        </button>
      </div>
    </div>
    <div class="products-input">
      <textarea #input placeholder="Ajouter un produit" [disabled]="items.length === 10"></textarea>
    </div>
    <p class="products-text">Séparer les produits avec des virgules.</p>
  `,
})
export class ProfileProProductsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('input') input: ElementRef<HTMLTextAreaElement>;
  @Output() valueChange = new EventEmitter<string[]>();
  @Input() items: string[] = [];
  @Input() maxItem = 10;

  constructor(
    private alert: AlertService,
  ) { }

  ngAfterViewInit() {
    this.input.nativeElement.addEventListener('keyup', e => {
      if (e.key === 'Enter') {
        const value = this.input.nativeElement.value;
        this.add(value.trim());
      } else if (e.key === ',') {
        const value = this.input.nativeElement.value;
        this.add(value.trim().slice(0, -1));
      }
    }, false);
  }

  ngOnDestroy() {
    this.input.nativeElement.removeEventListener('keyup', null, false);
  }

  add(item: string) {
    if (this.items.length === this.maxItem) {
      return;
    }

    if (this.items.indexOf(item) !== -1) {
      this.alert.present('Ce produit est déjà ajouté');
      return;
    }

    this.items.push(item);
    this.valueChange.emit(this.items);
    this.input.nativeElement.value = '';
  }

  remove(item: string) {
    if (this.items.length === 0) {
      return;
    }

    this.items = this.items.filter(i => i !== item);
    this.valueChange.emit(this.items);
  }
}
