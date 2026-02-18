import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService, BlogPost, Comment } from '../../../service/blog.service';

@Component({
  selector: 'app-read-blog',
  imports: [RouterLink, FormsModule],
  templateUrl: './read-blog.html',
  styleUrl: './read-blog.scss',
})
export class ReadBlog implements OnInit {
  post = signal<BlogPost | undefined>(undefined);
  comments = signal<Comment[]>([]);
  loading = signal(true);

  commentName = '';
  commentEmail = '';
  commentWebsite = '';
  commentBody = '';
  commentSubmitting = signal(false);
  commentMessage = signal('');
  commentError = signal('');

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blogService.getPostById(id).subscribe(post => {
      this.post.set(post);
      this.loading.set(false);
    });
    this.blogService.getCommentsByPostId(id).subscribe(comments => {
      this.comments.set(comments);
    });
  }

  get formattedDate(): string {
    const p = this.post();
    if (!p) return '';
    return new Date(p.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  formatCommentDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  get bodyParagraphs(): string[] {
    const p = this.post();
    if (!p) return [];
    return p.body.split('\n\n').filter(s => s.trim().length > 0);
  }

  submitComment(): void {
    if (!this.commentName.trim() || !this.commentBody.trim()) return;
    const postId = this.post()?.id;
    if (!postId) return;

    this.commentSubmitting.set(true);
    this.commentMessage.set('');
    this.commentError.set('');

    this.blogService.addComment(
      postId,
      this.commentName.trim(),
      this.commentBody.trim(),
      this.commentEmail.trim() || undefined,
      this.commentWebsite.trim() || undefined
    ).subscribe({
      next: (comment) => {
        this.comments.update(list => [...list, comment]);
        this.commentName = '';
        this.commentEmail = '';
        this.commentWebsite = '';
        this.commentBody = '';
        this.commentSubmitting.set(false);
        this.commentMessage.set('Comment posted! Thank you.');
        setTimeout(() => this.commentMessage.set(''), 4000);
      },
      error: (err) => {
        this.commentSubmitting.set(false);
        this.commentError.set(err.error?.error || 'Failed to post comment');
        setTimeout(() => this.commentError.set(''), 4000);
      },
    });
  }
}
