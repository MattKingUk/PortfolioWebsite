import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home').then(m => m.Home)
    },
    {
        path: 'blog',
        loadComponent: () => import('./blog/blog').then(m => m.Blog)
    },
    {
        path: 'blog/:id',
        loadComponent: () => import('./blog/blog-preview/read-blog/read-blog').then(m => m.ReadBlog)
    },
    {
        path: 'portfolio',
        loadComponent: () => import('./portfolio/portfolio').then(m => m.Portfolio)
    },
    {
        path: 'portfolio/:id',
        loadComponent: () => import('./portfolio/project-detail/project-detail').then(m => m.ProjectDetail)
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin').then(m => m.Admin)
    },
];
