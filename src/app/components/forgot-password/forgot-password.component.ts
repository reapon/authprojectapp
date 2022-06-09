import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Forgotpassword } from 'src/app/models/forgotpassword.model';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  securityQuestion!: any;
  forgetPasswordForm!: FormGroup;
  showMainForm:boolean=true;
  showPassForm:boolean=false;
  email:any;

  forgetPasswordModel : Forgotpassword=new Forgotpassword();

  constructor(private authService: ApiServiceService, private fb: FormBuilder,  private router : Router, private notifyService : NotificationService) { }

  ngOnInit(): void {
    this.getSecurityQuestions();
    this.CreateforgetPasswordForm();
  }


  CreateforgetPasswordForm() {
    this.forgetPasswordForm = this.fb.group(
      {
       
        Email: ['', Validators.required],
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
        ConfirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('Password')?.value === g.get('ConfirmPassword')?.value ? null : { mismatch: true };
  }

  getSecurityQuestions(){
    this.authService.getSecurityQuestions().subscribe(data=>{
      this.securityQuestion = [];

      this.securityQuestion = data.security;

    },err=>{
      console.log(err);
    })
  }

  verifyEmailWithSecurity(){


    let email = (document.getElementById("email") as HTMLInputElement).value;
    let question = (document.getElementById("security") as HTMLInputElement).value;
    let ans = (document.getElementById("ans") as HTMLInputElement).value;;
    this.email=email;

    this.authService.verifyUserWithSecurity(email, question, ans).subscribe(data=>{
      console.log(data);
      if(data==0){
        this.notifyService.showError("Credential Not Matching..", "Failed to varify");
        this.router.navigate(['/login']);
      }else{
        this.notifyService.showSuccess("You can reset your password", "Matched");
       
        this.showMainForm=false;
        this.showPassForm=true;
        
      }


    },err=>{
      console.log(err);
    })
  }

  resetPassword(){
    if (this.forgetPasswordForm.valid) {
      this.forgetPasswordModel.Email= this.email;
      this.forgetPasswordModel.Password=this.forgetPasswordForm.value.Password;


      
        this.authService.resetPassword(this.forgetPasswordModel).subscribe(
          data => {
          this.notifyService.showSuccess("Password reset successfully done", "Password reset");

            this.router.navigate(['/login']);
          },
          (error) => {
            this.notifyService.showError("Failed to reset password", error.error);;
          }
        );
      }else{
        // console.log("invalid");
        this.notifyService.showError("Reset Failed", "Fill the required field correctly");
      }
    }


}
