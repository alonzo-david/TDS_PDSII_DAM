import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { observable, Observable } from 'rxjs';

export interface IAuth {
  uid?: number;
  id?: number;
  avatar?: string;
  email?: string;
  address?: string;
  lastname?: string;
  name?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth: IAuth = {
    avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
    email: '',
    address: '',
  };

  constructor(private authenticate: Auth, private fireStore: Firestore) {}

  getAuth() {
    if (sessionStorage.getItem('user') !== null)
      this.auth = JSON.parse(sessionStorage.getItem('user'));
    console.log('getAuth ', this.auth);
    return this.auth;
  }

  // setUser(_user) {
  //   this.auth.email = _user.user.email;
  //   this.auth.uid = _user.user.uid;
  //   this.auth.address = 'direccion';
  //   this.getUserInfo(_user.user.uid);
  //   console.log('setUser: ', this.auth);
  //   sessionStorage.setItem('user', JSON.stringify(this.auth));
  // }

  async setUser(_user){
    const q = query(
      collection(this.fireStore, 'users'),
      where('id', '==', _user.user.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
      const filter = doc.data() as IAuth;
      
      this.auth.email = _user.user.email;
      this.auth.uid = _user.user.uid;

      this.auth.address = filter.address;
      this.auth.id = filter.id;
      this.auth.lastname = filter.lastname;
      this.auth.name = filter.name;

      sessionStorage.setItem('user', JSON.stringify(this.auth));
    });
  }

  async register({ email, password }: { email: string; password: string }) {
    try {
      const currentUser = await createUserWithEmailAndPassword(
        this.authenticate,
        email,
        password
      );

      return currentUser;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const currentUser = await signInWithEmailAndPassword(
        this.authenticate,
        email,
        password
      );

      return currentUser;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  logout() {
    sessionStorage.clear();
    return signOut(this.authenticate);
  }
}
