import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  tags: string[];
  excerpt: string;
  body: string;
  coverImage: string;
}

export interface Comment {
  id: number;
  postId: number;
  author: string;
  avatar: string;
  date: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>('/api/blog/posts').pipe(
      catchError(() => of([]))
    );
  }

  getPostById(id: number): Observable<BlogPost | undefined> {
    return this.http.get<BlogPost>(`/api/blog/posts/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  searchPosts(query: string): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>('/api/blog/posts/search', {
      params: { q: query },
    }).pipe(
      catchError(() => of([]))
    );
  }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/comments/post/${postId}`).pipe(
      catchError(() => of([]))
    );
  }

  addComment(postId: number, author: string, body: string, email?: string, website?: string): Observable<Comment> {
    return this.http.post<Comment>('/api/comments', {
      postId,
      author,
      body,
      email: email || '',
      website: website || '',
    });
  }

  getLatestPost(): Observable<BlogPost> {
    return this.http.get<BlogPost>('/api/blog/posts/latest');
  }
}