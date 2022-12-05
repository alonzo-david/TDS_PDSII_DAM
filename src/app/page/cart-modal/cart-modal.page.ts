import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CartService, Product } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.page.html',
  styleUrls: ['./cart-modal.page.scss'],
})
export class CartModalPage implements OnInit {
  cart: Product[] = [];

  constructor(
    private cartService: CartService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }

  close(){
    this.modalCtrl.dismiss();
  }

  async checkout(){

    if(!(this.cart.length > 0)){
      let alert = await this.alertCtrl.create({
        header: 'Carrito vacío!',
        message: 'Debes agregar al menos un producto.',
        buttons: ['OK']
      });
      alert.present().then(() => {
        this.modalCtrl.dismiss();
      });
    }else{
      this.modalCtrl.dismiss();
      this.router.navigate(['/checkout']);
    }
    // let alert = await this.alertCtrl.create({
    //   header: 'Gracias por tu pedido!',
    //   message: 'Estaremos entregando tu pedido lo antes posible.',
    //   buttons: ['OK']
    // });
    // alert.present().then(() => {
    //   this.modalCtrl.dismiss();
    // });
  }

}
