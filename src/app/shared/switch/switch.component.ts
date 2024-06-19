import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  styleUrls: ['./switch.component.scss'],
  template: `
    <div class="inner" [class.disabled]="disabled">
      <ng-container *ngFor="let item of values; let i = index">
        <div class="item" (click)="change(values[i])" [class.active]="values[i] === current">
          {{ labels[i] }}
        </div>
      </ng-container>
    </div>
    <div class="handler" [style.transform]="move"></div>
  `,
})
export class SwitchComponent implements OnInit {
  @Input() initial: any;
  @Input() values: any[] = [true, null, false];
  @Input() labels: string[] = ['Vrai', 'Null', 'Faux'];
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  backup: any;
  current: any;
  move: string;

  constructor(private elm: ElementRef) { }

  ngOnInit() {
    if (this.values.length === 0) {
      throw new Error('No values provided');
    }

    if (this.labels.length !== this.values.length) {
      throw new Error('Labels and values must have the same length');
    }

    if (this.initial) {
      this.current = this.initial;
    } else {
      this.current = this.values[0];
    }

    this.backup = this.current;

    this.elm.nativeElement.style.setProperty('--switch-items', this.values.length.toString());
    this.handleMove(this.current);
  }

  change(value: any) {
    if (value === this.current) {
      return;
    }

    this.backup = this.current;
    this.current = value;
    this.handleMove(value);
    this.valueChange.emit(value);
  }

  restore() {
    const value = this.backup;

    this.current = value;
    this.handleMove(value);
  }

  private handleMove(value: any) {
    if (value === this.values[0]) {
      this.move = `translateX(0)`;
    } else {
      this.move = `translateX(calc((100% * ${this.values.indexOf(value)}) + 4px))`;
    }
  }
}
