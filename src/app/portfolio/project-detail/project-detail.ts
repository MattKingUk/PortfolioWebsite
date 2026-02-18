import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project, PortfolioService } from '../../service/portfolio.service';

@Component({
  selector: 'app-project-detail',
  imports: [RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetail implements OnInit {
  project = signal<Project | undefined>(undefined);
  loading = signal(true);
  selectedImage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.portfolioService.getProjectById(id).subscribe(project => {
      this.project.set(project);
      this.loading.set(false);
    });
  }

  openLightbox(url: string): void {
    this.selectedImage.set(url);
  }

  closeLightbox(): void {
    this.selectedImage.set(null);
  }
}
