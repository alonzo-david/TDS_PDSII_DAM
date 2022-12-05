import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { AlertController } from '@ionic/angular';
import { collection, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { BehaviorSubject, from } from 'rxjs';

export interface Product {
  id?: string;
  image?: string;
  name?: string;
  description?: string;
  price?: number;
  amount?: number;
  availability?: number;
}

export interface Order{
  id?: string;
  idProduct?: string;
  idUser?: string;
  nameProduct?: string;
  amount?: number;
  price?: number;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  data: Product[] = [];
  orders: Order[] = [];
  // data: Product[] = [
  //   {
  //     id: 0,
  //     image: '',
  //     name: 'Filtro de Aire',
  //     description: 'Filtro de airea para diversidad de carros',
  //     price: 50.99,
  //     amount: 0,
  //     availability: 5,
  //   },
  //   {
  //     id: 1,
  //     image: '',
  //     name: 'Filtro de Aceite',
  //     description: 'Filtro de aceite para CX-5',
  //     price: 59.99,
  //     amount: 0,
  //     availability: 5,
  //   },
  //   {
  //     id: 2,
  //     image: '',
  //     name: 'Pastillas de Freno Delanteras',
  //     description: 'Pastillas de freno delantes para honda civic 2014',
  //     price: 575.99,
  //     amount: 0,
  //     availability: 5,
  //   },
  //   {
  //     id: 3,
  //     image: '',
  //     name: 'Pastillas de Freno Traseras',
  //     description: 'Pastillas de freno traseras para honda civic 2014',
  //     price: 550.99,
  //     amount: 0,
  //     availability: 5,
  //   },
  // ];

  private cart = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor(
    private alertController: AlertController,
    private fireStore: Firestore,
  ) {
    
  }

  async setOrders(idUser){

    const q = query(
      collection(this.fireStore, 'orders'),
      where('idUser', '==', idUser)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      const filter = doc.data() as Order;
      
      this.orders.push(filter);
    });
  }

  getOrders(){
    return this.orders;
  }

  async updateAmountProduct(cart){

    //import { doc, onSnapshot } from "firebase/firestore";
    const product = this.getProductById(cart.id);
    const productRef = doc(this.fireStore, "products", cart.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(productRef, {
      availability: product.availability - cart.amount,
    });
    
  }

  async setProducts() {
    const q = query(
      collection(this.fireStore, 'products'),
      where('availability', '>=', 1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      const filter = doc.data() as Product;
      
      this.data.push(filter);
    });
  }

  getProducts() {  
    console.log('products ', this.data);
    return this.data;
  }

  getProductById(id) {
    return this.data.find((x) => x.id === id);
  }

  getCart() {
    return this.cart;
  }

  getCartItemCount() {
    return this.cartItemCount;
  }

  clearCart(){
    this.cart = [];
    this.cartItemCount.next(0);
  }

  addProduct(product) {
    let added: boolean = false;
    let isAvailability: boolean = true;

    for (let p of this.cart) {
      if (p.id === product.id) {
        let filter = this.getProductById(p.id);
        if (p.amount < filter.availability) {
          p.amount += 1;
          added = true;
          break;
        } else {
          this.showAlert('¡Importante!', 'Ha llegado al limite del stock permitido.')
          isAvailability = false;
          break;
        }
      }
    }
    if (!added && isAvailability) {
      product.amount = 1;
      this.cart.push(product);
    }

    if (isAvailability) this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.amount -= 1;
        if (p.amount == 0) {
          this.cart.splice(index, 1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
