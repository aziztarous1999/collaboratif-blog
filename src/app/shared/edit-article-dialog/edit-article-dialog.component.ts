import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-edit-article-dialog',
  templateUrl: './edit-article-dialog.component.html'
})
export class EditArticleDialogComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditArticleDialogComponent>,
    private articleService: ArticleService,
    @Inject(MAT_DIALOG_DATA) public article: any
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.article.title, Validators.required],
      content: [this.article.content, Validators.required],
      tags: [this.article.tags.join(',')]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.selectedFile = file;
  }

  submit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('title', this.form.value.title);
    formData.append('content', this.form.value.content);

    const tags = this.form.value.tags
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    tags.forEach((tag:any) => formData.append('tags', tag));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.articleService.updateArticle(this.article._id, formData).subscribe({
      next: res => this.dialogRef.close(res.article),
      error: err => alert('Failed to update article.')
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
