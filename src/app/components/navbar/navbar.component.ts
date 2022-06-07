import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  email:any='';

  constructor(private router : Router,  private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.email=localStorage.getItem('email');
  }

  logout(){
    localStorage.clear();

    this.notifyService.showSuccess("Logged out..", "Logout");
    this.router.navigate(['/login']);

  }

}
