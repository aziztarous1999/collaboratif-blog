
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Article } from 'src/app/models/article.model';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { CreateArticleDialogComponent } from 'src/app/shared/create-article-dialog/create-article-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  articles: Article[] = [];
  role: string | null = null;
  stats: any = null;

  constructor(private articleService: ArticleService,private authService:AuthService,private dialog: MatDialog,
    private analyticsService: AnalyticsService) {
    this.authService.getRole().subscribe(role => {
      this.role = role;
    });
    
    this.authService.getRole().subscribe(role => {
      this.role = role;
      if (role === 'admin') {
        this.analyticsService.getAdminStats().subscribe(data => this.stats = data);
      } else if (role && role !== 'reader') {
        this.analyticsService.getUserStats().subscribe(data => this.stats = data);
      }
    });
  }

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
    this.authService.logout();
  }
  fetchArticles(): void {
    this.articleService.getArticles().subscribe((data) => {
      this.articles = data.map(article => {
        article.image = environment.apiUrl + "/uploads/" + article.image;
        return article;
      });
    });
  }

  createArticle(): void {
    const dialogRef = this.dialog.open(CreateArticleDialogComponent, {
      width: '600px'
    });
  
    dialogRef.afterClosed().subscribe((newArticle) => {
      if (newArticle) {
        this.fetchArticles();
      }
    });
  }
  
}
