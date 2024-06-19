import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-input-password',
  template: `
    <ng-content></ng-content>
    <div class="slot-end" (click)="toggle()" *ngIf="toggleVisibility">
      <ion-icon [src]="icon"></ion-icon>
    </div>
  `,
})
export class InputPasswordComponent implements AfterViewInit {
  @Input() defaultVisibility = false;
  @Input() toggleVisibility = false;

  icon: string;

  private input: HTMLInputElement;
  private visible = false;
  private icons = {
    on: 'assets/icons/visibility.svg',
    off: 'assets/icons/visibility-off.svg'
  };

  constructor(private elm: ElementRef) {
    this.icon = this.icons.off;
  }

  ngAfterViewInit(): void {
    this.input = this.elm.nativeElement.querySelector('input');
    this.update(this.defaultVisibility);
  }

  toggle() {
    this.visible = !this.visible;
    this.update(this.visible);
  }

  private update(visible: boolean) {
    if (this.input) {
      this.icon = visible ? this.icons.on : this.icons.off;
      this.input.setAttribute('type', visible ? 'text' : 'password');
    }
  }
}
