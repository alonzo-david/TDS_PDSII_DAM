import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as uuid from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  document:any = {
    nombre: '',
    descripcion: '',
    precio: 99.90
  };
  
  constructor(
    private activateRoute: ActivatedRoute,
    private fireStore: Firestore,
    private router: Router
  ) { 
    this.activateRoute.queryParams.subscribe(params => {
      console.log(params);
    })
  }

  ngOnInit() {
  }

  saveNFT(){
    const myId = uuid.v4();
    const nftDocRef = doc(this.fireStore, 'nfts/'+myId);
    setDoc(nftDocRef, this.document);
    this.router.navigate(['/nft']);

  }

}
