import { AfterViewInit, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-content',
  styleUrls: ['./content.component.scss'],
  template: `
    <div class="page-content" [ngClass]="{'with-tabs': tabs, 'with-header': header}">
      <ng-content></ng-content>
    </div>
  `,
})

export class ContentComponent implements AfterViewInit, OnDestroy {
  @Input() tabs = false;
  @Input() header = false;
  @Input() shadowScrolling = true;

  private listener: any;

  constructor(
    private renderer2: Renderer2,
    private elm: ElementRef,
  ) { }

  ngAfterViewInit() {
    const element = this.elm.nativeElement as HTMLDivElement;
    const navbar = element.closest('app-page').querySelector('app-navbar');

    if (navbar && this.shadowScrolling) {
      this.listener = this.renderer2.listen(element, 'scroll', e => {
        if ((e.target as Element).scrollTop > 5) {
          this.renderer2.addClass(navbar, 'shadow');
        } else {
          this.renderer2.removeClass(navbar, 'shadow');
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.listener) {
      this.listener();
    }
  }
}
