import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { AdminService, AdminComment } from '../service/admin.service';
import { BlogService, BlogPost } from '../service/blog.service';
import { PortfolioService } from '../service/portfolio.service';
import type { Project } from '../service/portfolio.service';

type Tab = 'settings' | 'blog' | 'portfolio' | 'comments' | 'password';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin implements OnInit {
  loginUsername = '';
  loginPassword = '';
  loginError = signal('');
  loginLoading = signal(false);

  activeTab = signal<Tab>('settings');

  settings = signal<Record<string, string>>({});
  settingsSaving = signal(false);
  settingsMessage = signal('');

  posts = signal<BlogPost[]>([]);
  postsLoading = signal(false);
  editingPost = signal<Partial<BlogPost> | null>(null);
  postSaving = signal(false);
  postMessage = signal('');
  postTagsInput = '';

  projects = signal<Project[]>([]);
  projectsLoading = signal(false);
  editingProject = signal<Partial<Project> | null>(null);
  projectSaving = signal(false);
  projectMessage = signal('');
  projectTagsInput = '';
  projectImagesInput = '';

  comments = signal<AdminComment[]>([]);
  commentsLoading = signal(false);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordMessage = signal('');
  passwordSaving = signal(false);

  constructor(
    public auth: AuthService,
    private adminService: AdminService,
    private blogService: BlogService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.loadTabData();
    }
  }

  login(): void {
    this.loginLoading.set(true);
    this.loginError.set('');
    this.auth.login(this.loginUsername, this.loginPassword).subscribe({
      next: () => {
        this.loginLoading.set(false);
        this.loadTabData();
      },
      error: (err) => {
        this.loginLoading.set(false);
        this.loginError.set(err.error?.error || 'Login failed');
      },
    });
  }

  logout(): void {
    this.auth.logout();
    this.loginUsername = '';
    this.loginPassword = '';
  }

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.loadTabData();
  }

  loadTabData(): void {
    switch (this.activeTab()) {
      case 'settings':
        this.loadSettings();
        break;
      case 'blog':
        this.loadPosts();
        break;
      case 'portfolio':
        this.loadProjects();
        break;
      case 'comments':
        this.loadComments();
        break;
    }
  }

  loadSettings(): void {
    this.adminService.getSettings().subscribe((s) => this.settings.set(s));
  }

  updateSetting(key: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.settings.update((s) => ({ ...s, [key]: value }));
  }

  saveSettings(): void {
    this.settingsSaving.set(true);
    this.settingsMessage.set('');
    this.adminService.updateSettings(this.settings()).subscribe({
      next: (s) => {
        this.settings.set(s);
        this.settingsSaving.set(false);
        this.settingsMessage.set('Settings saved!');
        setTimeout(() => this.settingsMessage.set(''), 3000);
      },
      error: () => {
        this.settingsSaving.set(false);
        this.settingsMessage.set('Failed to save settings');
      },
    });
  }

  settingsKeys(): string[] {
    return Object.keys(this.settings());
  }

  formatSettingLabel(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  loadPosts(): void {
    this.postsLoading.set(true);
    this.blogService.getPosts().subscribe((posts) => {
      this.posts.set(posts);
      this.postsLoading.set(false);
    });
  }

  newPost(): void {
    this.editingPost.set({
      title: '',
      author: 'Matt King',
      date: new Date().toISOString().split('T')[0],
      tags: [],
      excerpt: '',
      body: '',
      coverImage: '',
    });
    this.postTagsInput = '';
    this.postMessage.set('');
  }

  editPost(post: BlogPost): void {
    this.editingPost.set({ ...post });
    this.postTagsInput = post.tags.join(', ');
    this.postMessage.set('');
  }

  cancelPostEdit(): void {
    this.editingPost.set(null);
    this.postMessage.set('');
  }

  savePost(): void {
    const post = this.editingPost();
    if (!post) return;
    post.tags = this.postTagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    this.postSaving.set(true);
    this.postMessage.set('');

    const obs = post.id
      ? this.adminService.updatePost(post.id, post)
      : this.adminService.createPost(post);

    obs.subscribe({
      next: () => {
        this.postSaving.set(false);
        this.postMessage.set(post.id ? 'Post updated!' : 'Post created!');
        this.editingPost.set(null);
        this.loadPosts();
        setTimeout(() => this.postMessage.set(''), 3000);
      },
      error: (err) => {
        this.postSaving.set(false);
        this.postMessage.set(err.error?.error || 'Save failed');
      },
    });
  }

  deletePost(post: BlogPost): void {
    if (!confirm(`Delete "${post.title}"? This will also delete all comments.`)) return;
    this.adminService.deletePost(post.id).subscribe(() => this.loadPosts());
  }

  onCoverImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.adminService.uploadImage(file).subscribe({
      next: (res) => {
        const post = this.editingPost();
        if (post) {
          this.editingPost.set({ ...post, coverImage: res.url });
        }
      },
      error: (err) => this.postMessage.set(err.error?.error || 'Upload failed'),
    });
  }

  loadProjects(): void {
    this.projectsLoading.set(true);
    this.portfolioService.getProjects().subscribe((projects) => {
      this.projects.set(projects);
      this.projectsLoading.set(false);
    });
  }

  newProject(): void {
    this.editingProject.set({
      title: '',
      description: '',
      tags: [],
      coverImage: '',
      images: [],
      liveUrl: '',
      repoUrl: '',
      body: '',
      date: new Date().toISOString().split('T')[0],
    });
    this.projectTagsInput = '';
    this.projectImagesInput = '';
    this.projectMessage.set('');
  }

  editProject(project: Project): void {
    this.editingProject.set({ ...project });
    this.projectTagsInput = project.tags.join(', ');
    this.projectImagesInput = project.images.join('\n');
    this.projectMessage.set('');
  }

  cancelProjectEdit(): void {
    this.editingProject.set(null);
    this.projectMessage.set('');
  }

  saveProject(): void {
    const project = this.editingProject();
    if (!project) return;
    project.tags = this.projectTagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    project.images = this.projectImagesInput.split('\n').map((u) => u.trim()).filter(Boolean);
    this.projectSaving.set(true);
    this.projectMessage.set('');

    const obs = project.id
      ? this.adminService.updateProject(project.id, project)
      : this.adminService.createProject(project);

    obs.subscribe({
      next: () => {
        this.projectSaving.set(false);
        this.projectMessage.set(project.id ? 'Project updated!' : 'Project created!');
        this.editingProject.set(null);
        this.loadProjects();
        setTimeout(() => this.projectMessage.set(''), 3000);
      },
      error: (err) => {
        this.projectSaving.set(false);
        this.projectMessage.set(err.error?.error || 'Save failed');
      },
    });
  }

  deleteProject(project: Project): void {
    if (!confirm(`Delete "${project.title}"?`)) return;
    this.adminService.deleteProject(project.id).subscribe(() => this.loadProjects());
  }

  onProjectCoverUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.adminService.uploadImage(file).subscribe({
      next: (res) => {
        const p = this.editingProject();
        if (p) this.editingProject.set({ ...p, coverImage: res.url });
      },
      error: (err) => this.projectMessage.set(err.error?.error || 'Upload failed'),
    });
  }

  onProjectGalleryUpload(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;
    this.adminService.uploadMultipleImages(Array.from(files)).subscribe({
      next: (res) => {
        const urls = res.map((r) => r.url);
        this.projectImagesInput = this.projectImagesInput
          ? this.projectImagesInput + '\n' + urls.join('\n')
          : urls.join('\n');
      },
      error: (err) => this.projectMessage.set(err.error?.error || 'Upload failed'),
    });
  }

  loadComments(): void {
    this.commentsLoading.set(true);
    this.adminService.getCommentsAdmin().subscribe((comments) => {
      this.comments.set(comments);
      this.commentsLoading.set(false);
    });
  }

  deleteComment(comment: AdminComment): void {
    if (!confirm(`Delete comment by "${comment.author}"?`)) return;
    this.adminService.deleteComment(comment.id).subscribe(() => this.loadComments());
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMessage.set('Passwords do not match');
      return;
    }
    this.passwordSaving.set(true);
    this.passwordMessage.set('');
    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordSaving.set(false);
        this.passwordMessage.set('Password changed successfully!');
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        setTimeout(() => this.passwordMessage.set(''), 3000);
      },
      error: (err) => {
        this.passwordSaving.set(false);
        this.passwordMessage.set(err.error?.error || 'Failed to change password');
      },
    });
  }
}
