import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Comment } from 'src/app/models/comment.model';
import { ReplyDialogComponent } from 'src/app/shared/reply-dialog/reply-dialog.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent {
  
constructor(private dialog: MatDialog) {}
  @Input() comment!: Comment;
  @Output() reply = new EventEmitter<{ parentId: string; content: string }>();
  @Input() role!: string;
  @Output() delete = new EventEmitter<string>();

  handleReply(event: { parentId: string; content: string }) {
    this.reply.emit(event); // safely re-emit
  }

  
  openReplyModal(): void {
    const dialogRef = this.dialog.open(ReplyDialogComponent, {
      width: '400px',
      data: { author: this.comment.author.username },
      panelClass: 'dark-modal'
    });
  
    dialogRef.afterClosed().subscribe(content => {
      if (content) {
        this.reply.emit({
          parentId: this.comment._id,
          content
        });
      }
    });
  }
  
  deleteComment(): void {
    this.delete.emit(this.comment._id);
  }
}
