import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  coverImage: string;
  images: string[];
  liveUrl?: string;
  repoUrl?: string;
  body: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {
  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/api/portfolio/projects').pipe(
      catchError(() => of([]))
    );
  }

  getProjectById(id: number): Observable<Project | undefined> {
    return this.http.get<Project>(`/api/portfolio/projects/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }
}
