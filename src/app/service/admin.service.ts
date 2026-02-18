import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogPost } from './blog.service';

export interface AdminComment {
  id: number;
  postId: number;
  author: string;
  avatar: string;
  date: string;
  body: string;
  email: string;
  website: string;
  postTitle: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  images: string[];
  liveUrl: string;
  repoUrl: string;
  body: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private http: HttpClient) {}

  getSettings(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>('/api/settings');
  }

  updateSettings(settings: Record<string, string>): Observable<Record<string, string>> {
    return this.http.put<Record<string, string>>('/api/settings', { settings });
  }

  createPost(post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.post<BlogPost>('/api/blog/posts', post);
  }

  updatePost(id: number, post: Partial<BlogPost>): Observable<BlogPost> {
    return this.http.put<BlogPost>(`/api/blog/posts/${id}`, post);
  }

  deletePost(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/blog/posts/${id}`);
  }

  createProject(project: Partial<Project>): Observable<Project> {
    return this.http.post<Project>('/api/portfolio/projects', project);
  }

  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`/api/portfolio/projects/${id}`, project);
  }

  deleteProject(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/portfolio/projects/${id}`);
  }

  getCommentsAdmin(): Observable<AdminComment[]> {
    return this.http.get<AdminComment[]>('/api/comments/admin');
  }

  deleteComment(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`/api/comments/${id}`);
  }

  uploadImage(file: File): Observable<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<{ url: string; filename: string }>('/api/upload', formData);
  }

  uploadMultipleImages(files: File[]): Observable<{ url: string; filename: string }[]> {
    const formData = new FormData();
    for (const file of files) {
      formData.append('images', file);
    }
    return this.http.post<{ url: string; filename: string }[]>('/api/upload/multiple', formData);
  }
}
