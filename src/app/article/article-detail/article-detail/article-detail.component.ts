import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {
  articleId!: string;
  article: any;
  comments: any[] = [];
  role: string | null = null;
  canEdit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.articleId = this.route.snapshot.paramMap.get('id')!;
    this.fetchArticle();
    this.fetchComments();
    this.authService.getRole().subscribe(role => {
      this.role = role;
    });
  }

  fetchArticle(): void {
    this.articleService.getArticleById(this.articleId).subscribe((data:Article) => {
      this.article = data;
      this.article.image = environment.apiUrl + "/uploads/" + this.article.image;
      this.canEdit = this.authService.canEdit(this.article.author._id);
      console.log('Can edit:', this.article.author._id);
    });
  }

  fetchComments(): void {
    this.articleService.getCommentsByArticleId(this.articleId).subscribe((data:Comment[]) => {
      this.comments = data;
    });
  }
  logout() {
    this.authService.logout(); // removes token and navigates to login
  }
}
