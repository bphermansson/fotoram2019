import { Component, OnInit } from '@angular/core';
import { TempApiService } from '../shared/temp-api.service';

@Component({
  selector: 'app-temp',
  templateUrl: './temp.component.html',
  styleUrls: ['./temp.component.css']
})
export class TempComponent implements OnInit {
  temp
  constructor(private apiService: TempApiService) { }


  ngOnInit() {
    /*
    this.apiService.getTempOut().subscribe((data)=>{
      console.log(data);
 });*/
}
}
