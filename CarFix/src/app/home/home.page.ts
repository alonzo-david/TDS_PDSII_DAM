import { Component } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection } from 'firebase/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public productos:any;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private fireStore: Firestore
  ) {}

  ngOnInit() {
    if(sessionStorage.getItem("userEmail") === null){
      this.authService.logout();
      this.router.navigate(['/login']);
    }    
    this.getProducts();
  }

  getProducts(){
    const list = collection(this.fireStore, 'products');
    this.productos = collectionData(list);
  }

  viewDetail(item){
    console.log(item);
    this.router.navigate(['/detail'], {queryParams: {data: JSON.stringify(item)}});
  }
}
