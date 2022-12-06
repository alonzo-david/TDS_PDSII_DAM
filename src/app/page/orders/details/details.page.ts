import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService, IAuth } from 'src/app/services/auth.service';
import { CartService, Order } from 'src/app/services/cart.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  idGroupOrder: string;
  details: Order[] = [];
  auth: IAuth;

  constructor(
    private activateRoute: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
  ) { 
    const data = this.activateRoute.snapshot.queryParamMap.getAll('data');
    console.log('data ', data);
    this.idGroupOrder = data[0];
  }

  ngOnInit() {
    this.auth = this.authService.getAuth();

    this.cartService.setDetails(this.auth.id, this.idGroupOrder);
    this.details = this.cartService.getDetails();
  }

  getTotalDetails(){
    return this.cartService.getTotalDetails();
  }

}
