import { animate, style, transition, trigger } from '@angular/animations';

const ANIMATION_FORWARD = '400ms cubic-bezier(0.36,0.66,0.04,1)';
const ANIMATION_BACK = '200ms cubic-bezier(0.47,0,0.745,0.715)';

export const pageTransition = trigger('PageTransition', [
  transition(':enter', [
    style({ transform: 'translateY(56px)', opacity: 0.01 }),
    animate(ANIMATION_FORWARD, style({ transform: 'translateY(0px)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0px)', opacity: 1 }),
    animate(ANIMATION_BACK, style({ transform: 'translateY(56px)', opacity: 0.01 }))
  ])
]);

export const slideTransition = trigger('SlideTransition', [
  transition(':enter', [
    style({ transform: 'translateX(20px)', opacity: 0 }),
    animate('400ms ease', style({ transform: 'translateX(0px)', opacity: 1 }))
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0px)', opacity: 1 }),
    animate('100ms ease', style({ transform: 'translateX(-20px)', opacity: 0 }))
  ])
]);

export const fadeTransition = trigger('FadeTransition', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('400ms ease', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate('100ms ease', style({ opacity: 0 }))
  ])
]);
