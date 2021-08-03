import { Component, OnInit } from '@angular/core';
import { cssNumber } from 'jquery';
import * as XLSX from 'xlsx';
import { Questionpool } from '../model/questionpool';
import { Quiz } from '../model/quiz';
import {ExcelService} from '../services/excel.service';
import { QuestionpoolService} from '../services/questionpool.service';
@Component({
  selector: 'app-excelreader',
  templateUrl: './excelreader.component.html',
  styleUrls: ['./excelreader.component.css']
})
export class ExcelreaderComponent implements OnInit {
  public questionlist : Questionpool[] = [];
  data: [][];
  data1: [][];
  data2: any = [
    {
       
        "CATEGORYID": 1,
        "CATEGORYNAME": "BOOKS",
        "DESCRIPTION": "It contains all types of books",
        "IMAGE": "Books",
        "STATUS": "TRUE"
    },
    {
       
        "CATEGORYID": 2,
        "CATEGORYNAME": "EBOOKS",
        "DESCRIPTION": "It contains all types of ebooks",
        "IMAGE": "Ebooks",
        "STATUS": "TRUE"
    },
    {
     
        "CATEGORYID": 3,
        "CATEGORYNAME": "Bookss",
        "DESCRIPTION": "DESCRIPTION",
        "IMAGE": "IMAGE",
        "STATUS": "TRUE"
    }
  ]
  constructor(private excelService:ExcelService,private questionpoolService:QuestionpoolService) { }

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

      //Chay duoc 
      /*console.log(this.data);
      let x = this.data.slice(1);
      console.log(x);
      for(var k = 1;k < this.data.length;k++){
        console.log(this.data[k]);
        var quiz1 = this.data[k] as any;
        console.log(quiz1);
        var quiz:Quiz = new Quiz;
        var temp = quiz1[0] as string;
        var temp1 = quiz1[1] as number;
        var temp2 = quiz1[2] as number;
        console.log(temp +" "+temp1+" "+temp2);
        quiz.question = temp;
        quiz.point = temp1;
        quiz.time = temp2;
        this.quizlist.push(quiz);
      }*/

      //Chay duoc 
      console.log(this.data);
      let x = this.data.slice(1);
      console.log(x);
      for(var k = 1;k < this.data.length;k++){
        console.log(this.data[k]);
        var quiz1 = this.data[k] as any;
        console.log(quiz1);
        var question:Questionpool = new Questionpool;
        var temp = quiz1[0] as string;
        var temp1 = quiz1[1] as number;
        var temp2 = quiz1[2] as number;
        question.topicId = 1;
        question.quizId = "1";
        console.log(temp +" "+temp1+" "+temp2);
        question.question = temp;
        // quiz.point = temp1;
        question.time = temp2;
        this.questionpoolService.postquestionpool(question);
        this.questionlist.push(question);
      }
      
      console.log(this.questionlist);
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
  exportAsXLSX():void {
    this.excelService.exportAsExcelFile(this.data, 'myExcelFile');
 }
}