import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public currentUser = 'currentUser';
  public avatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  public appPages = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    // { title: 'Mi Perfil', url: '/profile', icon: 'person' },
    { title: 'Carrito de Compras', url: '/cartshop', icon: 'cart' },
    { title: 'Mis Pedidos', url: '/orders', icon: 'card' },
  ];
  userLogged: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = sessionStorage.getItem('userEmail');
  }

  onMenuEvent() {
    this.userLogged = sessionStorage.getItem('userEmail');
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
