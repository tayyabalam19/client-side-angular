import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Transaction } from '../../models/transaction';
import { User } from '../../models/user';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';
import { Course } from '../../models/course';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courseList: Array<Course>;
  errorMessage: string;
  infoMessage: string;
  currentUser: User;

  constructor(private userService:UserService,private courseService:CourseService,private router: Router) { 
    this.currentUser = this.userService.currentUserValue;
  }

  ngOnInit(){
    this.findAllCourses();
  }

  findAllCourses(){
    this.courseService.findAllCourses().subscribe(data => {
      this.courseList = data;
    });
  }

  enroll(course: Course){
    if(!this.currentUser){
      this.errorMessage  = "You should sign in to enroll a course"
    }
    var transaction  = new Transaction();
    transaction.userId = this.currentUser.id;
    transaction.course = course;
    this.courseService.enroll(transaction).subscribe(data =>{
      this.infoMessage = "Mission is completed";
    },err =>{
      this.errorMessage = "Unexpected error occured";
    })
  }

  detail(course: Course){
    localStorage.setItem("currentCourse",JSON.stringify(course));
    this.router.navigate(["/detail",course.id])
  }

}
