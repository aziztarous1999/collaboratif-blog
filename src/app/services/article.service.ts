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

  createArticle(data: FormData): Observable<any> {
    return this.http.post(`${this.articlesApiUrl}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }
  updateArticle(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.articlesApiUrl}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }

  deleteArticle(id: string): Observable<any> {
    return this.http.delete(`${this.articlesApiUrl}/${id}`);
  }
  getCommentsByArticleId(articleId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.commentsApiUrl}/${articleId}`);
  }
  createComment(articleId: string, content: string, parentId: string | null): Observable<Comment> {
    const body = { articleId, content, parentId };
    return this.http.post<Comment>(`${this.commentsApiUrl}`, body, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  deleteComment(commentId: string): Observable<any> {
    return this.http.delete(`${this.commentsApiUrl}/${commentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      }
    });
  }  
}
