import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AlreadyAuthGuard } from './auth/already-auth.guard';
import { HomepageComponent } from './homepage/homepage.component';
import { ArticleDetailComponent } from './article/article-detail/article-detail/article-detail.component';

const routes: Routes = [
  { path: '', component: HomepageComponent, pathMatch: 'full',
  canActivate: [AlreadyAuthGuard] },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  { path: 'articles/:id', component: ArticleDetailComponent, canActivate: [AuthGuard] },
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
      canActivate: [AlreadyAuthGuard],
  },

  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
