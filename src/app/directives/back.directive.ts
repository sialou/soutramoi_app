import { Directive, HostListener } from '@angular/core';
import { NavController } from '@ionic/angular';

@Directive({
  selector: '[app-back]'
})
export class AppBackDirective {
  constructor(private navCtrl: NavController) { }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    this.navCtrl.back();
  }
}
