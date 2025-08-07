import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { Article } from '../models/article.model';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articleService: ArticleService) {}

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
  
}
