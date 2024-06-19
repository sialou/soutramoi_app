import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Swiper } from 'swiper';

import { App } from '@capacitor/app';

import { slideTransition } from 'src/app/animations';
import { StorageService } from 'src/app/services/storage.service';
import { StatusBar, Style } from '@capacitor/status-bar';

interface Slide {
  id: number;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
  animations: [slideTransition],
})
export class OnboardingPage {
  swiper: Swiper;
  index = 0;
  slides: Slide[] = [
    {
      id: 1,
      title: '5K+ pro répertorié',
      description: 'Trouvez un prestataire parmis un large choix de professionnel répertorié',
      image: 'assets/img/screen-1.png',
    },
    {
      id: 2,
      title: 'Services de qualité',
      description: 'Des professionnels qui vous fournissent des services de qualité',
      image: 'assets/img/screen-2.png',
    },
    {
      id: 3,
      title: 'Entretien en ligne',
      description: 'Entretien en ligne avec les professionels depuis votre téléphone portable',
      image: 'assets/img/screen-3.png',
    },
  ];

  constructor(
    private router: Router,
    private platform: Platform,
    private storage: StorageService,
  ) { }

  ionViewWillEnter() {
    StatusBar.setStyle({ style: Style.Light });
  }

  ionViewWillLeave() {
    StatusBar.setStyle({ style: Style.Dark });
  }

  onSlideChange(swiper) {
    this.index = swiper.realIndex;
  }

  async next() {
    if (this.index === 2) {
      if (this.platform.is('hybrid')) {
        const info = await App.getInfo();

        await this.storage.set('soutramoi_intro', {
          version: info.version,
          date: (new Date()).toISOString(),
        });
      }

      this.router.navigateByUrl('/');
    } else {
      this.swiper.slideNext();
    }
  }

  prev() {
    if (this.index === 0) {
      return;
    }

    this.swiper.slidePrev();
  }
}
