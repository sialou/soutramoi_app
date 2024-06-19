import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-pro',
  templateUrl: './pro.page.html',
  styleUrls: ['./pro.page.scss']
})

export class ProPage implements OnInit {
  profile: Professional = {
    id: null,
    name: 'Flora Kouassi',
    job: 'Plombier professionnel',
    location: 'Abidjan/Koumassi',
    photoUrl: 'assets/img/profile.jpg',
    coverUrl: 'assets/img/cover2.jpg',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error fugit officia debitis totam hic ea. Laborum qui quisquam voluptatem et suscipit sed, accusamus vero consequatur assumenda, repellat quam possimus eligendi. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Error fugit officia debitis totam hic ea. Laborum qui quisquam voluptatem et suscipit sed, accusamus vero consequatur assumenda, repellat quam possimus eligendi.',
    services: [
      'Plomberie',
      'Electricité',
      'Chauffage',
      'Étanchéité',
      'Recherche de fuite d\'eau',
    ],
    price: '5000',
    coords: { lat: -3.9655, lng: 5.2834 },
    likes: 39,
    rate: 4,
    liked: true,
  };

  isIos: boolean;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private platform: Platform,
  ) {
    this.isIos = this.platform.is('ios');
  }

  ngOnInit() {
    const proId = Number(this.route.snapshot.paramMap.get('id'));
    this.profile.id = proId;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.loading = false;
    }, 2500);
  }

  ionViewDidLeave() { }

  like() {
    this.profile.liked = !this.profile.liked;
    this.profile.likes += this.profile.liked ? 1 : -1;
  }

  onReview(review: ReviewItem) {
    console.log('My review', review);
  }
}
