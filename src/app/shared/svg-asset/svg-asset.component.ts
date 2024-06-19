import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
  selector: 'svg-asset',
  styles: [`
    :host {
      display: inline-block;
      box-sizing: content-box !important;
    }
  `],
  template: ``,
})
export class SvgAssetComponent implements AfterViewInit, OnInit {
  /** Relative path from `src/assets/` */
  @Input() src: string;

  @Input() width: number = null;
  @Input() height: number = null;
  @Input() color: string = null;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    if (this.width) {
      this.element.nativeElement.style.width = this.width + 'px';
    }
    if (this.height) {
      this.element.nativeElement.style.height = this.height + 'px';
    }
  }

  ngAfterViewInit() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'assets/' + this.src, false);
    xhr.overrideMimeType('image/svg+xml');
    xhr.onload = e => {
      const svg = xhr.responseXML.documentElement;
      if (this.width) {
        svg.setAttribute('width', this.width.toString());
      }
      if (this.height) {
        svg.setAttribute('height', this.height.toString());
      }
      if (this.color) {
        svg.setAttribute('fill', this.color);
      }

      this.element.nativeElement.appendChild(svg);
    };
    xhr.send('');
  }
}
