import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl,FormGroup,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/service/department/department.service';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})

export class AddDepartmentComponent implements OnInit{

  departmentdata:any;
  active:any = ['Active','Inactive']
  message='';
  messageclass ='';
  error:boolean = false;
  isEdit:boolean = false;
  deptid:any;
  editdata:any;
  submitted:boolean = false;
  addDepartment!:FormGroup;

  constructor(private department:DepartmentService,private router:Router,private route:ActivatedRoute,private formBuilder:FormBuilder) {}

  ngOnInit(): void {
    console.log("ngOnint");
    this.deptid = this.route.snapshot.paramMap.get('id');
    console.log(this.deptid);
    this.route.params.subscribe(param=>{
      if(param && param['id']){
        console.log("Param >> ",param['id']);
        this.department.LoadbyID(param['id']).subscribe(resp=>{
          this.isEdit = true;
          this.addDepartment.patchValue(resp);
        })
      }
    })
    this.addDepartment = this.formBuilder.group({
      'departmentcode':['',Validators.required],
      'departmentname':['',Validators.required],
      'active' : ['']
    })
  }

  SaveData(){
    if(!this.isEdit){
      this.submitted = true;
      if(this.addDepartment.valid){
        this.department.SaveData(this.addDepartment.value).subscribe(result => {
          console.log("result",result);
          this.router.navigate(['/department']);
        });
      }
    }else if(this.isEdit){
      this.submitted = true;
      if(this.addDepartment.valid){
        this.department.update(this.deptid,this.addDepartment.value).subscribe(data =>{
          this.isEdit=false;
          this.router.navigate(['/department']);
        })
      }
    }
  }

  change(e: any) {
    this.active = e.target.value;
  }
  
}
