import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { Quiz } from '../model/quiz';
@Component({
  selector: 'app-excelreader',
  templateUrl: './excelreader.component.html',
  styleUrls: ['./excelreader.component.css']
})
export class ExcelreaderComponent implements OnInit {
  data: [][];
  data1: [][];
  constructor() { }

  ngOnInit(): void {
  }
  onFileChangeQuiz(evt: any) {
    const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log(this.data);
      let x = this.data.slice(1);
      console.log(x);
      // for (var i in x){
      //   console.log(i);
      //   for (var key in x[i]){
      //       console.log( key + ": " + x[i][key]);
      //   }
      // }
      var quizlist : Quiz[];
      for (var i in x){
        // console.log(i);
        var quiz:Quiz;
        // for (var key in x[i]){
        //     console.log( key + ": " + x[i][key]);
        // }
          for (var key in x[i]){
            // console.log( key + ": " + x[i][key]);
            switch (key){
              case "0":
                console.log(x[i][key]);
                quiz.question = x[i][key];
              case "1":
                console.log(x[i][key]);
                quiz.point = x[i][key];
              case "2":
                  console.log(x[i][key]);
                  quiz.time = x[i][key];
            }
          }
          quizlist.push(quiz);
      }
      console.log(quizlist);
    };

    reader.readAsBinaryString(target.files[0]);

  }
  onFileChangeAnswer(evt: any) {
    const target : DataTransfer =  <DataTransfer>(evt.target);
    
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;

      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname : string = wb.SheetNames[0];

      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      console.log(ws);

      this.data1 = (XLSX.utils.sheet_to_json(ws, { header: 1 }));

      console.log(this.data);
      let x = this.data.slice(1);
      console.log(x);
      for (var i in x){
        console.log(i);
        for (var key in x[i]){
            console.log( key + ": " + x[i][key]);
        }
    }

    };

    reader.readAsBinaryString(target.files[0]);

  }
}
