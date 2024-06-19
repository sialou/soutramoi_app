import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  styleUrls: ['./avatar.component.scss'],
  template: `
    <div class="inner" [style.borderRadius]="innerRadius">
      <div
        class="image"
        [style]="'background-image: url(' + url + '); border-radius: ' + innerRadius + ';'"
        *ngIf="url && url.length"
      ></div>
    </div>
  `,
})
export class AvatarComponent implements OnInit {
  @Input() url?: string;
  @Input() padding?= 0;
  @Input() size?: number | string = 50;
  @Input() radius?: number | string = '50%';
  @Input() innerRadius?: number | string;
  @Input() shadow = false;
  @Input() backgroundColor = '#FFFFFF';

  @HostBinding('style.padding') hPadding!: string;
  @HostBinding('style.width') hWidth!: string;
  @HostBinding('style.height') hHeight!: string;
  @HostBinding('style.border-radius') hRadius!: string;
  @HostBinding('style.background-color') hBackgroundColor!: string;
  @HostBinding('class.shadow') hShadow = false;

  ngOnInit() {
    this.hPadding = `${this.padding}px`;
    this.hBackgroundColor = this.backgroundColor;
    this.hShadow = this.shadow;

    if (typeof this.size === 'number') {
      this.hWidth = `${this.size}px`;
      this.hHeight = `${this.size}px`;
    } else {
      this.hWidth = this.size;
      this.hHeight = this.size;
    }

    if (typeof this.radius === 'number') {
      this.hRadius = `${this.radius}px`;
    } else {
      this.hRadius = this.radius;
    }

    if (!this.innerRadius) {
      this.innerRadius = this.hRadius;
    } else if (typeof this.innerRadius === 'number') {
      this.innerRadius = `${this.innerRadius}px`;
    }
  }
}
