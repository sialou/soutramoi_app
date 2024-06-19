import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-spinner-infinity',
  styleUrls: ['./spinner-infinity.component.scss'],
  template: `
    <svg fill="none" [ngStyle]="svgStyle" viewBox="0 0 131 55">
      <defs>
        <path
          d="M46.57 45.5138C36.346 55.4954 19.8919 55.4954 9.66794 45.5138C-0.55598 35.5321 -0.55598 19.4678 9.66794 9.48624C19.8919 -0.495412 36.346 -0.495412 46.57 9.48624L84.4303 45.5138C94.6543 55.4954 111.108 55.4954 121.332 45.5138C131.556 35.5321 131.556 19.4678 121.332 9.48624C111.108 -0.495412 94.6543 -0.495412 84.4303 9.48624L46.57 45.5138Z"
          id="spinners-react-infinity-path"
        />
      </defs>
      <use
        [attr.stroke]="secondaryColor"
        [attr.stroke-width]="strokeWidth"
        xlink:href="#spinners-react-infinity-path"
      />
      <use
        fill="none"
        stroke="currentColor"
        stroke-dasharray="1, 347"
        stroke-dashoffset="75"
        stroke-linecap="round"
        [attr.stroke-width]="strokeWidth"
        [ngStyle]="dashStyle"
        xlink:href="#spinners-react-infinity-path"
      />
    </svg>
  `,
})
export class SpinnerInfinityComponent implements OnInit {
  @Input() color = 'var(--ion-color-primary)';
  @Input() secondaryColor = '#E2E3E4';
  @Input() width: number | string = 70;
  @Input() height: number | string = 'auto';
  @Input() speed = 100;
  @Input() still = false;
  @Input() styles = {};
  @Input() thickness = 130;

  @HostBinding('style.width') hWidth: string;
  @HostBinding('style.height') hHeight: string;

  get svgStyle() {
    return {
      color: this.color,
      overflow: 'visible',
      width: this.normalizeSize(this.width),
      height: this.normalizeSize(this.height),
      ...(typeof this.styles === 'string' ? JSON.parse(this.styles) : this.styles),
    };
  }

  get strokeWidth() {
    return 7 * (this.thickness / 100);
  }

  get dashStyle() {
    return !this.still ? { animation: `spinner-infinity ${140 / this.speed}s linear infinite` } : {};
  }

  ngOnInit() {
    this.hWidth = this.normalizeSize(this.width);
    this.hHeight = this.normalizeSize(this.height);
  }

  private normalizeSize(size: number | string) {
    return (parseFloat(size.toString()).toString() === size.toString() ? `${size}px` : size.toString());
  }
}
