import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../services/auth.service';
import * as uuid from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  credentials!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private fireStore: Firestore
  ) {}

  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.saveUser();
      this.router.navigateByUrl('/home', { replaceUrl: true });
    } else {
      // this.showAlert('Registration failed', 'Please try again!');
      const alert = this.alertController.create({
        header: 'Login Error',
        message: 'Error al iniciar sesion',
        buttons: ['Ok'],
      });
      (await alert).present();
    }
  }

  saveUser(){
    const myId = uuid.v4();
    const nftDocRef = doc(this.fireStore, 'users/'+myId);
    
    this.credentials.controls['id'].setValue(myId);
    setDoc(nftDocRef, this.credentials.value);
    this.router.navigate(['/home']);
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
