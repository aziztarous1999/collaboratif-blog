import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reply-dialog',
  templateUrl: './reply-dialog.component.html'
})
export class ReplyDialogComponent {
  replyContent: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { author: string }
  ) {}

  submit() {
    this.dialogRef.close(this.replyContent.trim());
  }

  cancel() {
    this.dialogRef.close();
  }
}
