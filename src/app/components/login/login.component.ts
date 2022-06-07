import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginModel : Login=new Login();



  constructor(private authService: ApiServiceService, private fb: FormBuilder,  private router : Router, private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.CreateLoginForm();
  }


  CreateLoginForm() {
    this.loginForm = this.fb.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required]],
    });
  }


  login() {
    if (this.loginForm.valid) {
      this.loginModel.Email = this.loginForm.value.Email;
      this.loginModel.Password = this.loginForm.value.Password;

      // this.model = Object.assign({}, this.loginForm.value);
      this.authService.login(this.loginModel).subscribe(data => {
          this.notifyService.showSuccess("Login Success", "Login");
          this.router.navigate(['/profile']);
        },
        (error) => {
         
          console.log(error);
          this.notifyService.showError("Login Failed", error.error);
        },
        () => {
         
        }
      );
    } 
  }

}
