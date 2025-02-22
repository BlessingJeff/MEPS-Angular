import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators,FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {CurrencyService} from 'src/app/service/currency/currency.service';

@Component({
  selector: 'app-add-currency',
  templateUrl: './add-currency.component.html',
  styleUrls: ['./add-currency.component.css']
})
export class AddCurrencyComponent implements OnInit  {
  currencyData:any;
  isEdit:boolean = false;
  currencyid:any;
  submitted:boolean = false;
  addCurrency!:FormGroup;

  constructor(private service:CurrencyService,private router:Router,private route:ActivatedRoute,private formBuilder:FormBuilder) {}

  ngOnInit(): void {
    console.log("ngOnint");
    this.currencyid = this.route.snapshot.paramMap.get('id');
    console.log(this.currencyid);
    this.route.params.subscribe(param=>{
      if(param && param['id']){
        console.log("Param >> ",param['id']);
        this.service.FindbyID(param['id']).subscribe(resp=>{
          this.isEdit = true;
          this.addCurrency.patchValue(resp);
        })
      }
    })
    this.addCurrency = this.formBuilder.group({
      'code':['',Validators.required],
      'name':['',Validators.required],
      'symbol' : ['']
    })
  }


  SaveData(){
    if(!this.isEdit){
      this.submitted = true;
      if(this.addCurrency.valid){
        this.service.SaveData(this.addCurrency.value).subscribe(result => {
          console.log("result",result);
          this.router.navigate(['/currency']);
        });
      }
    }else if(this.isEdit){
      this.submitted = true;
      if(this.addCurrency.valid){
        this.service.update(this.currencyid,this.addCurrency.value).subscribe(data =>{
          this.isEdit=false;
          this.router.navigate(['/currency']);
        })
      }
    }
  }



}
