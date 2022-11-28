import { Component, OnInit } from '@angular/core';
import { collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-cartshop',
  templateUrl: './cartshop.page.html',
  styleUrls: ['./cartshop.page.scss'],
})
export class CartshopPage implements OnInit {
  public cartshop: any = [];

  constructor() {}

  ngOnInit() {
    let json = sessionStorage.getItem('cartshop');
    let data = JSON.parse(json);

    console.log(data);
    //this.cartshop.push(data);
    // this.cartshop = collectionData(data);
    this.cartshop = data;
    console.log(this.cartshop);
  }

  checkout() {}

  removeCartItem() {}

  increaseCartItem() {}

  decreaseCartItem() {}
}
