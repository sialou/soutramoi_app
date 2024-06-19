import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ripple',
  styles: [`
    :host {
      position: relative;
      display: block;
      width: auto;
      height: auto;
    }

    .ripple-inner {
      display: inherit;
      align-items: inherit;
      justify-content: inherit;
      position: relative;
      width: 100%;
      height: 100%;
    }
  `],
  template: `
    <div class="ripple-inner" matRipple [matRippleColor]="color">
      <ng-content></ng-content>
    </div>
  `,
})

export class RippleComponent {
  @Input() color = 'rgba(0, 0, 0, 0.1)';
}
