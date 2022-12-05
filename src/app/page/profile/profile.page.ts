import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, IAuth } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  auth: IAuth;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.auth = this.authService.getAuth();
    // if(this.auth.email !== ''){
    //   this.router.navigate(['/login']);
    // }
  }

}
