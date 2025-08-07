import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Article } from '../models/article.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private articlesApiUrl = environment.apiUrl+'/api/articles';
  private commentsApiUrl = environment.apiUrl+'/api/comments';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesApiUrl);
  }

  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.articlesApiUrl}/${id}`);
  }

  createArticle(data: any): Observable<Article> {
    return this.http.post<Article>(this.articlesApiUrl, data);
  }

  updateArticle(id: string, data: any): Observable<Article> {
    return this.http.put<Article>(`${this.articlesApiUrl}/${id}`, data);
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.articlesApiUrl}/${id}`);
  }
  getCommentsByArticleId(articleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsApiUrl}/${articleId}`);
  }
}
