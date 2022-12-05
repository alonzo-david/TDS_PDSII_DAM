import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAuth, AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { Menu, MenuService } from './services/menu.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  menu: Menu[] = [];
  auth: IAuth;
  constructor(
    private menuService: MenuService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
  ) {
    
  }

  ngOnInit() {
    this.menu = this.menuService.getMenu();
    this.auth = this.authService.getAuth();
    if(this.auth.email !== ''){
      this.router.navigate(['/home']);
    }
  }

  onMenuEvent() {
    //sessionStorage.getItem('userEmail');
  }

  logout(){
    this.cartService.clearCart();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
