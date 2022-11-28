import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  public document: any;
  public disponibilidad: any;

  constructor(private activateRoute: ActivatedRoute, private router: Router) {
    const data = this.activateRoute.snapshot.queryParamMap.getAll('data');
    const producto = JSON.parse(data[0]);
    console.log(producto);
    this.document = producto;

    this.document.cantidad = Array(producto.disponibilidad)
      .fill(producto.disponibilidad)
      .map((x, i) => i + 1); // [0,1,2,3,4]
  }

  ngOnInit() {}

  addCartShop() {
    console.log(this.document);
    let parent = [];
    let child = {
      id: this.document.id,
      nombre: this.document.nombre,
      descripcion: this.document.descripcion,
      cantidad: this.document.cantidad,
      precio: this.document.precio,
    };

    parent.push(child);

    sessionStorage.setItem('cartshop', JSON.stringify(parent));
    this.router.navigate(['/cartshop']);
  }

  onChange(value) {
    console.log(value);
    this.document.cantidad = value;
  }
}
