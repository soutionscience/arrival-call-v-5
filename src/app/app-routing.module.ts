import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo:'register', 
     pathMatch:'full'},

  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./PAGES/tracking/tracking.module').then( m => m.TrackingPageModule)
  },
  {
    path: 'single-tracking',
    loadChildren: () => import('./PAGES/single-tracking/single-tracking.module').then( m => m.SingleTrackingPageModule)
  },
  {
    path: 'success',
    loadChildren: () => import('./PAGES/success/success.module').then( m => m.SuccessPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./PAGES/register/register.module').then( m => m.RegisterPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
