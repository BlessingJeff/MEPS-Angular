import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators,FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {ClassificationService} from 'src/app/service/classification/classification.service';
@Component({
  selector: 'app-add-classification',
  templateUrl: './add-classification.component.html',
  styleUrls: ['./add-classification.component.css']
})
export class AddClassificationComponent implements OnInit{
  data:any;
  active:any = ['Active','Inactive']
  isEdit:boolean = false;
  deptid:any;
  editdata:any;
  submitted:boolean = false;
  addClassification!:FormGroup;

  constructor(private http:HttpClient,private service:ClassificationService,private router:Router,private route:ActivatedRoute,private formBuilder:FormBuilder ){}
  ngOnInit(): void {
    console.log("ngOnint");
    this.deptid = this.route.snapshot.paramMap.get('id');
    console.log(this.deptid);
    this.route.params.subscribe(param=>{
      if(param && param['id']){
        console.log("Param >> ",param['id']);
        this.service.FindbyID(param['id']).subscribe(resp=>{
          this.isEdit = true;
          this.addClassification.patchValue(resp);
        })
      }
    })
    this.addClassification = this.formBuilder.group({
      'code':['',Validators.required],
      'name':['',Validators.required],
      'active' : ['']
    })
  }
  SaveData(){
    if(!this.isEdit){
      this.submitted = true;
      if(this.addClassification.valid){
        this.service.SaveData(this.addClassification.value).subscribe(result => {
          console.log("result",result);
          this.router.navigate(['/hospital-data']);
        });
      }
    }else if(this.isEdit){
      this.submitted = true;
      if(this.addClassification.valid){
        this.service.update(this.deptid,this.addClassification.value).subscribe(data =>{
          this.isEdit=false;
          this.router.navigate(['/hospital-data']);
        })
      }
    }
  }

  change(e: any) {
    this.active = e.target.value;
  }

}
