import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/models/article.model';
import { ArticleService } from 'src/app/services/article.service';
import { AuthService } from 'src/app/services/auth.service';
import { SocketService } from 'src/app/services/socket.service';
import { EditArticleDialogComponent } from 'src/app/shared/edit-article-dialog/edit-article-dialog.component';
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
  newCommentContent = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private socketService:SocketService,
    private toastr: ToastrService
  ) {
    this.socketService.onNewComment().subscribe(data => {
      this.toastr.success(data.message);
    });
  }

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
  onNewComment(): void {
    const content = this.newCommentContent.value?.trim();
    if (!content) return;
  
    this.articleService.createComment(this.articleId, content, null).subscribe(newComment => {
      this.comments.push(newComment);
      this.newCommentContent.reset();
    });
  }
  onReplyToComment(event: { parentId: string; content: string }): void {
    this.articleService
      .createComment(this.articleId, event.content, event.parentId)
      .subscribe(() => {
        this.fetchComments();
      });
  }
  onDeleteComment(commentId: string): void {
  if (confirm('Are you sure you want to delete this comment?')) {
    this.articleService.deleteComment(commentId).subscribe(() => {
      this.fetchComments();
    });
  }
}

onDeleteArticle(): void {
  if (confirm('Are you sure you want to delete this article?')) {
    this.articleService.deleteArticle(this.article._id).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}

editArticle(): void {
  const dialogRef = this.dialog.open(EditArticleDialogComponent, {
    width: '600px',
    data: this.article
  });

  dialogRef.afterClosed().subscribe(updated => {
    if (updated) {
      this.fetchArticle();
      this.fetchComments();
    }
  });
}


}
