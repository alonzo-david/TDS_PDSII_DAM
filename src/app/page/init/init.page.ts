import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartService, Product } from 'src/app/services/cart.service';
import { CartModalPage } from '../cart-modal/cart-modal.page';

@Component({
  selector: 'app-init',
  templateUrl: './init.page.html',
  styleUrls: ['./init.page.scss'],
})
export class InitPage implements OnInit {
  cart = [];
  products: Product[];
  cartItemCount: BehaviorSubject<number>;

  constructor(
    private cartService: CartService,
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
    //this.cartService.setProducts();
    this.products = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  

  addToCart(product) {
    this.cartService.addProduct(product);
    //this.animateCSS('tada', true);
  }

  async openCart() {
    //this.animateCSS('bounceOutLeft', true);

    let modal = await this.modalCtrl.create({
      component: CartModalPage,
      cssClass: 'cart-modal',
    });
    modal.onWillDismiss().then(() => {
      // this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft');
      // this.animateCSS('bounceInLeft');
    });
    modal.present();
  }

  

}
