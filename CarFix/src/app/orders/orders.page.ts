import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  public pedidos = [
    {
      id: 1, 
      nombre: 'Pedido 1',
      total: 15,
    },
    {
      id: 2, 
      nombre: 'Pedido 2',
      total: 15,
    },
  ]
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  viewDetailOrder(item){
    console.log('order detail', item);
    this.router.navigate(['/orders/detail'], {queryParams: {data: JSON.stringify(item)}});
  }

}
