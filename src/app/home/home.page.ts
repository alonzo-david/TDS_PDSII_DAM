import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { CartModalPage } from '../page/cart-modal/cart-modal.page';
import { CartService, Product } from '../services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  cart = [];
  //products = [];
  products: Product[];
  cartItemCount: BehaviorSubject<number>;

  @ViewChild('cart', { static: false, read: ElementRef }) fab: ElementRef;

  constructor(
    private cartService: CartService,
    private modalCtrl: ModalController,
  ) {}

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
      //this.fab.nativeElement.classList.remove('animated', 'bounceOutLeft');
      //this.animateCSS('bounceInLeft');
    });
    modal.present();
  }

  animateCSS(animationName, keepAnimated = false) {
    const node = this.fab.nativeElement;
    node.classList.add('animated', animationName);

    //https://github.com/daneden/animate.css
    function handleAnimationEnd() {
      if (!keepAnimated) {
        node.classList.remove('animated', animationName);
      }
      node.removeEventListener('animationend', handleAnimationEnd);
    }
    node.addEventListener('animationend', handleAnimationEnd);
  }

  
}
