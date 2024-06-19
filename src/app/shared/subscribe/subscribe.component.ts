import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-subscribe',
  styleUrls: ['./subscribe.component.scss'],
  template: `
    <app-page class="page-subscribe">
      <app-navbar></app-navbar>
      <app-content>
        <div class="content-header">
          <h4>Choisis ton profil</h4>
          <h5>Créé ton profil professionnel afin de proposer tes services ou continue comme simple utilisateur.</h5>
        </div>
        <div class="content-card">
          <div class="card-inner">
            <div class="subscribe-picture">
              <img src="assets/img/subscribe2.jpg" alt="">
            </div>
            <div class="subscribe-content">
              <h4>Deviens un Professionnel</h4>
              <p>Tu souhaites proposer tes services à des milliers d’utilisateurs ou potentiels clients ?Rejoins la plateforme SoutraMoi.</p>
            </div>
            <div class="subscribe-actions">
              <button type="button" app-button color="secondary" (click)="confirm.emit()">Je suis un professionnel</button>
              <button type="button" app-button (click)="cancel.emit()">Continuer comme simple utilisateur</button>
            </div>
          </div>
        </div>
      </app-content>
    </app-page>
  `,
})
export class SubscribeComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
