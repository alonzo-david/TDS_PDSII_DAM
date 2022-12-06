import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { AlertController, ToastController } from '@ionic/angular';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
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

export interface Order {
  id?: string;
  idProduct?: string;
  idUser?: string;
  nameProduct?: string;
  amount?: number;
  price?: number;
  idGroup?: string;
}
@Injectable({
  providedIn: 'root',
})
export class CartService {
  data: Product[] = [];
  details: Order[] = [];
  orders = [];

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
    private toastService: ToastController,
  ) {}

  async setOrders(idUser) {
    this.orders = [];
    let collectionOrder = [];

    const q = query(
      collection(this.fireStore, 'orders'),
      where('idUser', '==', idUser)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      const filter = doc.data() as Order;

      collectionOrder.push(filter.idGroup);
    });

    collectionOrder = collectionOrder.filter((item, index, array) => array.indexOf(item) === index);
    this.orders.push(...collectionOrder);

  }

  getOrders() {
    return this.orders;
  }

  async setDetails(idUser, idGroupOrder) {
    this.details = [];
    const q = query(
      collection(this.fireStore, 'orders'),
      where('idUser', '==', idUser), where('idGroup', '==', idGroupOrder)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      const filter = doc.data() as Order;

      this.details.push(filter);
    });
  }

  getDetails(){
    return this.details;
  }

  getTotalDetails(){
    return this.details.reduce((accumulator, detail) => accumulator + detail.price, 0);
  }

  async updateAmountProduct(cart) {
    //import { doc, onSnapshot } from "firebase/firestore";
    const product = this.getProductById(cart.id);
    const productRef = doc(this.fireStore, 'products', cart.id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(productRef, {
      availability: product.availability - cart.amount,
    });
  }

  async setProducts() {
    //this.data = [];
    const q = query(
      collection(this.fireStore, 'products'),
      where('availability', '>=', 1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, ' => ', doc.data());
      const filter = doc.data() as Product;

      this.data.push(filter);
    });
  }

  getProducts() {
    this.setProducts();
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

  clearCart() {
    this.data = [];
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
          this.toastAlert(
            'Ha llegado al limite del stock permitido.',
            'warning'
          );
          isAvailability = false;
          break;
        }
      }
    }
    if (!added && isAvailability) {
      product.amount = 1;
      this.cart.push(product);
      this.toastAlert('Agregado correctamente', 'success');
    }

    if (isAvailability) this.cartItemCount.next(this.cartItemCount.value + 1);
  }

  decreaseProduct(product) {
    for (let [index, p] of this.cart.entries()) {
      if (p.id === product.id) {
        p.amount -= 1;
        if (p.amount == 0) {
          this.cart.splice(index, 1);
          this.toastAlert('Producto eliminado', 'danger');
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
    this.toastAlert('Producto eliminado', 'danger');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  async toastAlert(message, color){
    const toast = await this.toastService.create({
      message,
      duration: 2000,
      color,
    });

    await toast.present();
  }
}
