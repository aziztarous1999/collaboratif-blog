import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ArticleService } from 'src/app/services/article.service';

@Component({
  selector: 'app-create-article-dialog',
  templateUrl: './create-article-dialog.component.html'
})
export class CreateArticleDialogComponent {
  form: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private articleService: ArticleService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CreateArticleDialogComponent>
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['']
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
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

    this.articleService.createArticle(formData).subscribe({
      next: res => {
        this.toastr.success('Article has been created!');
        this.dialogRef.close(res.article)
      },
      error: err => alert('Failed to create article.')
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
