import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { doc, setDoc } from 'firebase/firestore';
import { AuthService, IAuth } from 'src/app/services/auth.service';
import { CartService, Order, Product } from 'src/app/services/cart.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
  cart: Product[] = [];
  formOrder: FormGroup = this.fb.group<Order>({
    id: '',
    idProduct: '',
    idUser: '',
    nameProduct: '',
    amount: 0,
    price: 0,
  });
  auth: IAuth;
  product: Product;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private fireStore: Firestore,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.cart = this.cartService.getCart();
  }

  getTotal() {
    return this.cart.reduce((i, j) => i + j.price * j.amount, 0);
  }

  async finish() {
    //this.credentials.controls['id']
    
    this.auth = this.authService.getAuth();
    
    this.cart.forEach((data) => {
      const myId = uuid.v4();
      this.formOrder.controls['id'].setValue(myId);
      this.formOrder.controls['idProduct'].setValue(data.id);
      this.formOrder.controls['idUser'].setValue(this.auth.id);
      this.formOrder.controls['price'].setValue(data.price);
      this.formOrder.controls['amount'].setValue(data.amount);
      this.formOrder.controls['nameProduct'].setValue(data.name);

      const nftDocRef = doc(this.fireStore, 'orders/' + myId);
      setDoc(nftDocRef, this.formOrder.value);

      this.cartService.updateAmountProduct(data);
      //this.router.navigate(['/home']);
    });
    

    let alert = await this.alertController.create({
      header: '¡Pedido realizado!',
      message: 'Gracias por tu preferencia.',
      buttons: ['OK'],
    });
    alert.present().then(() => {
      this.cartService.clearCart();
      this.router.navigate(['/home']);
    });
  }

}
