import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SwalPortalTargets, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { css } from '@emotion/css';
import { from, Subscription } from 'rxjs';

import { matchValidator } from 'src/app/helpers';
import { fadeTransition } from 'src/app/animations';
import { AlertService } from 'src/app/services/alert.service';
import { HttpService } from 'src/app/services/http.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'profile-password',
  styleUrls: ['./profile-password.component.scss'],
  animations: [fadeTransition],
  template: `
    <div class="app-card">
      <app-list-item
        [svgIcon]="'lock'"
        [title]="'Mot de passe'"
        [subTitle]="'Mètre à jour le mot de passe'"
        (click)="modal.fire()"
      ></app-list-item>
    </div>

    <swal
      #modal
      title="Nouveau mot de passe"
      [heightAuto]="false"
      [showConfirmButton]="false"
      [allowOutsideClick]="false"
      [customClass]="customClass"
    >
      <section *swalPortal="swalTargets.confirmButton" [class]="styles.portal">
        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <p [class]="styles.info">Au moins 8 caractères minimum, une lettre majuscule et un caractère spéciale.</p>
          <app-input-password [toggleVisibility]="true">
            <input type="password" placeholder="Mot de passe" formControlName="password">
          </app-input-password>
          <app-input-password [toggleVisibility]="true">
            <input type="password" placeholder="Confirmer le mot de passe" formControlName="passwordConfirm">
          </app-input-password>
          <button type="submit" app-button color="secondary" [disabled]="!form.valid">Mèttre à jour</button>
          <div [class]="styles.cancelContainer">
            <button type="button" (click)="modal.close()" [class]="styles.cancel">Annuler</button>
          </div>
        </form>
        <div @FadeTransition [class]="styles.loading" *ngIf="loading">
          <app-spinner-infinity
            [width]="100"
            [secondaryColor]="'rgba(var(--ion-color-primary-rgb),0.15)'"
          ></app-spinner-infinity>
          <div [class]="styles.loadingMessage">Mise à jour en cours...</div>
        </div>
      </section>
    </swal>
  `,
})
export class ProfilePasswordComponent implements OnDestroy {
  @ViewChild('modal') readonly modal!: SwalComponent;

  @Output() valueChange = new EventEmitter<any>();
  @Input() user: User;

  form: FormGroup;
  loading = false;
  customClass: any = {};

  styles = {
    portal: css`
      position: relative;
    `,
    popup: css`
      width: 80% !important;
    `,
    cancelContainer: css`
      text-align: center;
    `,
    cancel: css`
      display: inline-block;
      margin-top: 15px;
      padding: 8px 20px;
      width: auto;
      height: auto;
      background: transparent;
      border: none;
      color: rgba(var(--ion-color-secondary-rgb), 0.5);
    `,
    info: css`
      margin-top: 5px;
      margin-bottom: 20px;
      text-align: center;
      color: var(--ion-color-medium-shade);
      opacity: 0.6;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.3;
    `,
    loading: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #FFFFFF;
    `,
    loadingMessage: css`
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
    `,
  };

  private subscriptions: Subscription[] = [];

  constructor(
    public readonly swalTargets: SwalPortalTargets,
    private app: AppService,
    private alert: AlertService,
    private http: HttpService,
  ) {
    this.customClass.popup = this.styles.popup;

    this.form = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    }, {
      validators: [
        matchValidator(['password', 'passwordConfirm']),
      ],
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  submit() {
    if (!this.form.valid) {
      return;
    }

    const { password } = this.form.value;
    const { id_token } = this.user;
    const body = { password, id_token };

    this.loading = true;

    const sub = from(this.http.post('/me/password', body)).subscribe({
      next: (user: User) => {
        this.loading = false;
        this.valueChange.emit(user);

        this.form.reset();
        this.alert.present('Mot de passe mis à jour');
      },
      error: (err) => {
        const text = this.app.handlingError(err, false);
        this.loading = false;

        this.alert.present({ text, allowOutsideClick: false, confirmButtonText: 'Réessayer' }).then(result => {
          if (result.isConfirmed) {
            this.modal.fire();
          }
        });
      }
    });

    this.subscriptions.push(sub);
  }
}
