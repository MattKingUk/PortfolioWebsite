import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogPost } from '../../service/blog.service';

@Component({
  selector: 'app-blog-preview',
  imports: [RouterLink],
  templateUrl: './blog-preview.html',
  styleUrl: './blog-preview.scss',
})
export class BlogPreview {
  @Input({ required: true }) post!: BlogPost;
  @Input() featured = false;

  get formattedDate(): string {
    return new Date(this.post.date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
}
