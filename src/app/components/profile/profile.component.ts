import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ApiServiceService } from 'src/app/services/api-service.service';
import { NotificationService } from 'src/app/services/notification.service';

import * as moment from 'moment';


declare var $:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  dob:any;
  gender:any;
  fullName:any;
  mobile:any;
  email:any;
  securityQuestion:any;
  securityAns:any;

  profileForm!: FormGroup;
  userModel : User=new User();

  constructor(private authService: ApiServiceService, private fb: FormBuilder,  private router : Router, private notifyService : NotificationService, private datepipe: DatePipe) { }



  ngOnInit(): void {
    this.getProfileData(localStorage.getItem('userID'));
    this.CreateProfileForm();
    $(".date").flatpickr({
      dateFormat: "d-m-Y",
      allowInput: true,      
    });

  }
  CreateProfileForm() {
    this.profileForm = this.fb.group(
      {
        UserID: ['', Validators.required],
        // SecurityQuestionID: ['0', Validators.required],
        // SecurityAns: ['', Validators.required],
        Gender: ['0', Validators.required],
        Mobile: ['', Validators.required],
        DOB: ['', Validators.required],
        FullName: ['', Validators.required],

      }
     
    );
  }




  getProfileData(id:any){
    this.authService.getProfileData(id).subscribe(data=>{
      const user = data.profile[0];
      console.log(user)
      this.dob = user.dob == "1900-01-01T00:00:00" ? "Not Available" : this.datepipe.transform(user.dob, 'dd/MM/yyyy'); 
      this.gender = user.gender == "" ? "Not Available" : user.gender; 
      this.fullName = user.fullName;
      this.mobile = user.mobile == "" ? "Not Available" : user.mobile;
      this.email = user.email;
      this.securityQuestion = user.securityQuestion;
      this.securityAns= user.securityAns;

    },err=>{
      console.log(err);
    })
  }

  onEdit(){

    this.profileForm = this.fb.group({


      UserID: [localStorage.getItem('userID'), Validators.required],
      Gender: [this.gender == "Not Available"?"0": this.gender, Validators.required],
      Mobile: [this.mobile == "Not Available"?"": this.mobile, Validators.required],
      DOB: [this.dob == "Not Available"?"": this.dob, Validators.required],
      FullName: [this.fullName, Validators.required],
    
      // DDate: [dateIncrease.toISOString().replace(/T.*/,'').split('-').reverse().join('-'), Validators.nullValidator],
      
    });


  }

  profileUpdate(){
    if (this.profileForm.valid && this.profileForm.value.Gender!='0') {

      var DDate = $("#date").val();
      let parsedDDate = moment(DDate,"DD-MM-YYYY");
      let outputDDate = parsedDDate.format("YYYY-MM-DD");
      this.profileForm.value.DOB = outputDDate;


      this.userModel.FullName=this.profileForm.value.FullName;
      this.userModel.Gender=this.profileForm.value.Gender;
      this.userModel.Mobile=this.profileForm.value.Mobile;
      this.userModel.DOB = this.profileForm.value.DOB;
      this.userModel.UserID = this.profileForm.value.UserID;

      console.log(this.userModel);
      
        this.authService.register(this.userModel).subscribe(
          data => {
          this.notifyService.showSuccess("Profile Updated", "Update");
          let ref = document.getElementById('cancel');
          ref?.click();

          this.getProfileData(localStorage.getItem('userID'));
            // this.router.navigate(['/login']);
          },
          (error) => {
            this.notifyService.showError("Profile Update Failed", error.error);;
          }
        );
      }else{
        this.notifyService.showError("Profile Update Failed", "Fill the required field correctly");
      }
  }

}
