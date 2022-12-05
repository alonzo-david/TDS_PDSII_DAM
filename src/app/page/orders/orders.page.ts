import { Component, OnInit } from '@angular/core';
import { AuthService, IAuth } from 'src/app/services/auth.service';
import { CartService, Order } from 'src/app/services/cart.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  orders: Order[] = [];
  auth: IAuth;
  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.auth = this.authService.getAuth();

    this.cartService.setOrders(this.auth.id);
    this.orders = this.cartService.getOrders();
  }


}
