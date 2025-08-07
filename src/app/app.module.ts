import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './homepage/homepage.component';
import { MatIconModule } from '@angular/material/icon';
import { ArticleDetailComponent } from './article/article-detail/article-detail/article-detail.component';
import { CommentComponent } from './article/comment/comment.component';
import { ReplyDialogComponent } from './shared/reply-dialog/reply-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateArticleDialogComponent } from './shared/create-article-dialog/create-article-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EditArticleDialogComponent } from './shared/edit-article-dialog/edit-article-dialog.component';
import { TokenExpiryDialogComponent } from './shared/token-expiry-dialog/token-expiry-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ArticleDetailComponent,
    CommentComponent,
    ReplyDialogComponent,
    CreateArticleDialogComponent,
    EditArticleDialogComponent,
    TokenExpiryDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 5000,
      progressBar: true,
    }),
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
