import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from 'src/app/models/register.model';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  registerModel : Register=new Register();

  securityQuestion!: any;

  constructor(private authService: ApiServiceService, private fb: FormBuilder,  private router : Router, private notifyService : NotificationService) { }


  ngOnInit() {
    this.CreateRegisterForm();
    this.getSecurityQuestions();
  }


  getSecurityQuestions(){
    this.authService.getSecurityQuestions().subscribe(data=>{
      this.securityQuestion = [];

      this.securityQuestion = data.security;

    },err=>{
      console.log(err);
    })
  }


  CreateRegisterForm() {
    this.registerForm = this.fb.group(
      {
        FullName: ['', Validators.required],
        Email: ['', [Validators.required, Validators.email]],
        SecurityQuestionID: ['0', Validators.required],
        SecurityAns: ['', Validators.required],
        Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(8)]],
        ConfirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('Password')?.value === g.get('ConfirmPassword')?.value ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid && this.registerForm.value.SecurityQuestionID!='0') {
      // this.model = Object.assign({}, this.registerForm.value);
      this.registerModel.FullName=this.registerForm.value.FullName;
      this.registerModel.Email=this.registerForm.value.Email;
      this.registerModel.Password=this.registerForm.value.Password;
      this.registerModel.SecurityQuestionID = this.registerForm.value.SecurityQuestionID;
      this.registerModel.SecurityAns = this.registerForm.value.SecurityAns;

      console.log(this.registerModel);
      
        this.authService.register(this.registerModel).subscribe(
          data => {
          this.notifyService.showSuccess("Register Success", "Register");

            this.router.navigate(['/login']);
          },
          (error) => {
            // console.log(error);
            this.notifyService.showError("Register Failed", error.error);;
          }
        );
      }else{
        // console.log("invalid");
        this.notifyService.showError("Register Failed", "Fill the required field correctly");
      }
    }


}
