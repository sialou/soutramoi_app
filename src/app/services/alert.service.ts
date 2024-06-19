import { Injectable } from "@angular/core";
import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class AlertService {
  present(opts: SweetAlertOptions | string): Promise<SweetAlertResult> {
    const settings: SweetAlertOptions = typeof opts === "string" ? { text: opts } : opts;
    settings.heightAuto = false;

    return Swal.fire(settings);
  }

  dismiss() {
    return Swal.close();
  }

  error() {
    return this.present({
      title: "Un problème est survenu",
      text: "Impossible de charger les données, veuillez réessayer plus tard.",
    });
  }
}
