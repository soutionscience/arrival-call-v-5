import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SingleTrackingPage } from './single-tracking.page';

const routes: Routes = [
  {
    path: '',
    component: SingleTrackingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleTrackingPageRoutingModule {}
