import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'cart-modal',
    loadChildren: () => import('./page/cart-modal/cart-modal.module').then( m => m.CartModalPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./page/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./page/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./page/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./page/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'init',
    loadChildren: () => import('./page/init/init.module').then( m => m.InitPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    // RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
