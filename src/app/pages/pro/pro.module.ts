import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared';
import { ProPage } from './pro.page';
import { ProPageRoutingModule } from './pro-routing.module';
import { ReviewsCommentComponent } from './components/reviews-comment.component';
import { ReviewsCounterComponent } from './components/reviews-counter.component';
import { ProReviewsFormComponent } from './components/pro-reviews-form.component';
import { ProReviewsListComponent } from './components/pro-reviews-list.component';
import { ProMapComponent } from './components/pro-map.component';
import { ProWorksComponent } from './components/pro-works.component';
import { ProPlaceholderComponent } from './components/pro-placeholder.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    ProPageRoutingModule
  ],
  declarations: [
    ProPage,
    ReviewsCommentComponent,
    ProReviewsFormComponent,
    ReviewsCounterComponent,
    ProPlaceholderComponent,
    ProReviewsListComponent,
    ProWorksComponent,
    ProMapComponent,
  ]
})
export class ProPageModule { }
