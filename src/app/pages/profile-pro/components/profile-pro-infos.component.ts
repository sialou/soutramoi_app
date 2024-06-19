import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'profile-pro-infos',
  styleUrls: ['./profile-pro-infos.component.scss'],
  template: `
    <form [formGroup]="form" novalidate>
      <app-input floatLabel>
        <select id="job" formControlName="job" required>
          <option [ngValue]="null">Sélectionner un service...</option>
          <optgroup label="Batiment">
            <option value="Maçon">Maçon</option>
            <option value="Staffeur">Staffeur</option>
            <option value="Plombier">Plombier</option>
            <option value="Électricien">Électricien</option>
            <option value="Carreleur">Carreleur</option>
          </optgroup>
          <optgroup label="Mécanique">
            <option value="Tapissier">Tapissier</option>
            <option value="Aboisso">Aboisso</option>
            <option value="Dabou">Dabou</option>
            <option value="Man">Man</option>
            <option value="Odiéné">Odiéné</option>
          </optgroup>
        </select>
        <label for="job">Secteur d'activité</label>
      </app-input>

      <app-input floatLabel>
        <input type="text" id="address" placeholder="Entrez le nom de votre entreprise" formControlName="company" required>
        <label for="address">Nom de votre entreprise <small>(facultatif)</small></label>
      </app-input>

      <app-input floatLabel>
        <textarea id="description" placeholder="Ajoutez une courte description" formControlName="description" required></textarea>
        <label for="description">Description</label>
      </app-input>
      <p class="infos-text">
        Une brève présentation de vous ou décrire vos services et produits, afin d’aider les gens à vous trouver plus facilement sur SoutraMoi. (255 caractères maximun).
      </p>
    </form>
  `,
})
export class ProfileProInfosComponent implements OnInit, OnDestroy {
  @Output() valueChange = new EventEmitter<any[]>();
  @Input() payload: ProfessionalData;

  form: FormGroup;

  private subscriptions: Subscription[] = [];

  constructor() {
    this.form = new FormGroup({
      job: new FormControl(''),
      company: new FormControl(''),
      description: new FormControl(''),
    });
  }

  ngOnInit() {
    this.form.controls.job.setValue(this.payload.job_id);
    this.form.controls.company.setValue(this.payload.company_name);
    this.form.controls.description.setValue(this.payload.description);

    ['job', 'company', 'description'].forEach(field => {
      const sub = this.form.controls[field].valueChanges.subscribe(value => {
        this.valueChange.emit([field, value]);
      });

      this.subscriptions.push(sub);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
