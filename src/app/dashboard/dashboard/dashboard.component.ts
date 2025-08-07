// src/app/dashboard/dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleService,private authService:AuthService) {}

  ngOnInit() {
    this.articleService.getArticles().subscribe({
      next: (res) => {
        this.articles = res.map(article => {
          article.image = environment.apiUrl + "/uploads/" + article.image;
          return article;
        });
      },
      error: (err) => console.error('Failed to load articles', err)
    });
  }
  logout() {
    this.authService.logout(); // removes token and navigates to login
  }
}
