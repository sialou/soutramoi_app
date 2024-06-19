import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { defineCustomElements } from "@ionic/pwa-elements/loader";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();
  document.oncontextmenu = () => false;
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((e) => console.log(e));

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);
