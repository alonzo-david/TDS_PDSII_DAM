import { Injectable } from '@angular/core';

export interface Menu {
  title: string;
  url: string;
  icon: string;
}
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menu: Menu[] = [
    { title: 'Inicio', url: '/home', icon: 'home' },
    { title: 'Perfil', url: '/profile', icon: 'person' },
    // { title: 'Carrito de Compras', url: '/cartshop', icon: 'cart'},
    { title: 'Mis Pedidos', url: '/orders', icon: 'card' },
  ];
  
  constructor() {}

  getMenu() {
    return this.menu;
  }

}
