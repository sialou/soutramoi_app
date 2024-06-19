import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { SwalComponent, SwalPortalTargets } from "@sweetalert2/ngx-sweetalert2";
import { FilePicker, File as PickerFile } from "@robingenz/capacitor-file-picker";
import { SweetAlertCustomClass } from "sweetalert2";
import { BehaviorSubject, from, Subscription } from "rxjs";
import Croppie from "croppie";
import { css } from "@emotion/css";

import { fadeTransition } from "src/app/animations";
import { AppService } from "src/app/services/app.service";
import { HttpService } from "src/app/services/http.service";
import { AlertService } from "src/app/services/alert.service";

type ComponentState = "loading" | "done" | "error" | "init";

@Component({
  selector: "app-picture-updater",
  styleUrls: ["./picture-updater.component.scss"],
  animations: [fadeTransition],
  template: `
    <swal
      #modal
      title="Photo de profil"
      [heightAuto]="false"
      [showConfirmButton]="false"
      [allowOutsideClick]="false"
      [customClass]="styles.popup"
    >
      <section *swalPortal="swalTargets.confirmButton" [class]="styles.portal">
        <div>
          <div id="profile-cropper" [class]="styles.preview"></div>
          <div [class]="styles.actions">
            <button
              type="button"
              app-button
              color="secondary"
              [disabled]="!finish"
              (click)="submit()"
            >
              Mèttre à jour
            </button>
            <button type="button" (click)="cancel()" [class]="styles.cancel">
              Annuler
            </button>
          </div>
        </div>
        <div @FadeTransition [class]="styles.loading" *ngIf="state.value === 'loading'">
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
export class PictureUpdaterComponent implements OnDestroy, AfterViewInit {
  @ViewChild("modal") readonly modal!: SwalComponent;
  @Output() ready = new EventEmitter<PictureUpdaterComponent>();
  @Output() valueChange = new EventEmitter<User>();

  idToken: string;
  file: PickerFile = null;
  cropper: Croppie = null;
  finish = false;
  type: "photo" | "cover" = "photo";
  state = new BehaviorSubject<ComponentState>("init");

  styles = {
    portal: css`
      position: relative;
    `,
    popup: css`
      width: 80% !important;
    ` as SweetAlertCustomClass,
    preview: css``,
    actions: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin-top: 20px;
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
    loading: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ffffff;
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
    private http: HttpService,
    private alert: AlertService
  ) {}

  ngAfterViewInit() {
    this.ready.emit(this);
  }

  ngOnDestroy() {
    if (this.cropper) {
      this.cropper.destroy();
    }

    this.unsubscribe();
  }

  pick(type: "photo" | "cover") {
    this.type = type;
    this.cropInit();

    FilePicker.pickFiles({
      types: ["image/png", "image/jpeg", "image/jpg"],
      multiple: false,
    }).then(
      (result) => {
        if (result.files.length > 0) {
          this.file = result.files[0];
          this.modal.fire();
        }
      },
      (err) => this.app.handlingError(err)
    );
  }

  async submit() {
    const data = await this.cropper.result({
      type: "base64",
      format: "jpeg",
      quality: 1,
      size: {
        width: 512,
        height: this.type === "photo" ? 512 : 247,
      },
    });

    const body: any = { id_token: this.idToken };

    if (this.type === "photo") {
      body.photo = data;
    } else {
      body.cover = data;
    }

    this.state.next("loading");

    const sub = from(this.http.post("/me/profile/pictures", body)).subscribe({
      next: (user: User) => {
        this.state.next("done");
        this.valueChange.emit(user);
        this.unsubscribe();
        this.alert.present("Photo de profil mise à jour");
      },
      error: (err) => {
        this.state.next("error");
        this.unsubscribe();
        this.app.handlingError(err);
      },
    });

    this.subscriptions.push(sub);
  }

  cancel() {
    this.unsubscribe();
    this.modal.close();
  }

  private cropInit() {
    if (this.cropper) {
      this.cropper.destroy();
    }

    const sub = this.modal.didOpen.subscribe(() => {
      const element = document.getElementById("profile-cropper");

      const cropper = new Croppie(element, {
        enableZoom: true,
        enableResize: false,
        enableOrientation: false,
        viewport: {
          type: "square",
          width: 150,
          height: this.type === "photo" ? 150 : 73,
        },
      });

      cropper
        .bind({
          url: `data:${this.file.mimeType};base64,${this.file.data}`,
          orientation: 1,
        })
        .then(() => (this.finish = true));

      this.cropper = cropper;
      const bundary: HTMLElement = document.querySelector(
        ".croppie-container .cr-boundary"
      );

      if (bundary) {
        bundary.classList.remove(this.type === "photo" ? "cover" : "photo");
        bundary.classList.add(this.type);
      }
    });

    this.subscriptions.push(sub);
  }

  private unsubscribe() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
