// ======= AI GENERATED SEED SCRIPT =======

/**
 * Seed script — populates the database with initial demo data.
 * Run with:  node seed.js
 */
require('dotenv').config();
const db = require('./db');

// ── Blog Posts ──────────────────────────────────────────────
const POSTS = [
  {
    title: 'Building a Liquid Glass UI with Angular',
    author: 'Matt King',
    date: '2026-02-10',
    tags: ['Angular', 'CSS', 'Design'],
    excerpt: 'Explore how to create stunning frosted-glass interfaces using modern CSS backdrop-filter and Angular components.',
    body: `Glassmorphism has taken the design world by storm, and for good reason — it adds depth and elegance to any interface without feeling heavy.\n\nIn this post, we'll walk through the process of building a fully responsive liquid glass UI using Angular. We'll cover the core CSS techniques including backdrop-filter, layered box-shadows, and gradient overlays that create the illusion of translucent, frosted surfaces.\n\nThe key to a convincing glass effect lies in combining multiple subtle layers:\n\n1. **Background blur** — Using \`backdrop-filter: blur()\` to softly diffuse whatever sits behind the element.\n2. **Gradient overlays** — Subtle white-to-transparent gradients that simulate light refraction.\n3. **Border highlights** — Thin borders with varying opacity to mimic the edge of real glass.\n4. **Shadow depth** — Multiple box-shadows (both outer and inset) to create a sense of thickness.\n\nWe'll also look at how to wrap this in a reusable Angular directive so you can apply the effect consistently across your entire application.\n\nPerformance considerations matter too — backdrop-filter can be expensive on lower-end devices, so we'll discuss fallback strategies and how to detect support using CSS \`@supports\` queries.\n\nBy the end, you'll have a production-ready glass design system that looks incredible on modern browsers while degrading gracefully elsewhere.`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  },
  {
    title: 'My Journey Into Full-Stack Development',
    author: 'Matt King',
    date: '2026-01-25',
    tags: ['Career', 'Full-Stack', 'Personal'],
    excerpt: 'A reflection on how I transitioned from front-end tinkering to building complete applications from database to deployment.',
    body: `When I first started coding, I was fascinated by making things look good in the browser. CSS animations, pixel-perfect layouts, interactive JavaScript — that was my world.\n\nBut over time, I realized that the most interesting problems lived beyond the browser. How does data flow from a database to the screen? How do you handle authentication securely? How do you deploy something so it stays up at 3 AM?\n\nThe jump to full-stack was intimidating. Suddenly I needed to understand Node.js, Express, PostgreSQL, Docker, CI/CD pipelines, and about a hundred other things. But each new concept clicked into place like a puzzle piece, and the bigger picture started to emerge.\n\nHere are a few things I wish I'd known earlier:\n\n- **Start with the API.** Design your endpoints before you build the UI. It forces you to think about data shapes early.\n- **Database design matters immensely.** A well-normalised schema saves you from painful refactors later.\n- **Docker is your friend.** Containerising early means "it works on my machine" stops being a meme.\n- **Don't ignore DevOps.** CI/CD pipelines aren't glamorous, but they free you to ship with confidence.\n\nToday, I genuinely enjoy the full breadth of software development. There's something deeply satisfying about building an entire system from scratch — from the database migrations all the way to the responsive UI.\n\nIf you're a front-end developer considering the jump: do it. The learning curve is real, but the payoff is enormous.`,
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
  },
  {
    title: 'Why I Chose Angular Over React for My Portfolio',
    author: 'Matt King',
    date: '2026-01-12',
    tags: ['Angular', 'React', 'Opinion'],
    excerpt: 'An honest comparison of the two frameworks and why Angular ended up being the right fit for this project.',
    body: `This is a question I get asked a lot: "Why Angular?" In a world where React dominates the conversation, choosing Angular can feel like swimming against the current.\n\nBut here's the thing — Angular isn't just a view library. It's an opinionated, batteries-included framework that gives you routing, forms, HTTP handling, dependency injection, and a powerful CLI out of the box.\n\nFor a portfolio site, you might think that's overkill. And maybe it is — but here's why I did it anyway:\n\n**1. Structured architecture from day one.** Angular's module and component system encouraged me to organize my code properly. I knew exactly where things belonged.\n\n**2. TypeScript by default.** No configuration needed. Interfaces, strict typing, and IDE autocompletion made development faster and less error-prone.\n\n**3. Signals and modern reactivity.** Angular's new signal-based reactivity (introduced in v16 and refined since) is elegant. It's simple, performant, and doesn't require the mental gymnastics of \`useEffect\` dependency arrays.\n\n**4. Built-in routing.** Setting up lazy-loaded routes with Angular's router is straightforward. No need for a third-party library.\n\n**5. Long-term maintainability.** The Angular team follows semantic versioning and provides clear migration paths. My code won't rot.\n\nThis isn't a "React bad" post. React is excellent, and I use it professionally. But for this project, Angular felt like the right tool — and I'm glad I went with it.`,
    coverImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&q=80',
  },
  {
    title: 'Designing for Accessibility Without Sacrificing Aesthetics',
    author: 'Matt King',
    date: '2025-12-18',
    tags: ['Accessibility', 'Design', 'CSS'],
    excerpt: 'How to build beautiful, inclusive interfaces that work for everyone — including keyboard and screen reader users.',
    body: `There's a persistent myth in web development that accessibility means ugly. That adding ARIA labels and focus indicators will somehow ruin your carefully crafted design.\n\nThis couldn't be further from the truth.\n\nAccessibility and aesthetics aren't at odds — in fact, the best designs are accessible by nature. Clear typography, strong contrast ratios, logical tab order, and visible focus states don't just help users with disabilities; they make the experience better for everyone.\n\nHere are practical steps I follow in every project:\n\n- **Use semantic HTML.** \`<button>\`, \`<nav>\`, \`<main>\`, and \`<article>\` aren't just for screen readers — they give your markup meaning.\n- **Ensure colour contrast.** WCAG AA requires a 4.5:1 ratio for normal text. Tools like the Chrome DevTools contrast checker make this trivial.\n- **Design focus states intentionally.** Don't just remove the outline — replace it with something that matches your design language.\n- **Test with a keyboard.** If you can't navigate your entire site with Tab and Enter, something is broken.\n- **Add skip-to-content links.** They're invisible until focused, but they save keyboard users from tabbing through your entire navbar.\n\nAccessibility isn't a checklist you complete at the end. It's a mindset you adopt from the start. And when you do it well, your design actually gets better.`,
    coverImage: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
  },
  {
    title: 'Optimising Angular Performance: Lessons from Production',
    author: 'Matt King',
    date: '2025-11-30',
    tags: ['Angular', 'Performance', 'Best Practices'],
    excerpt: 'Real-world techniques for keeping your Angular app fast — from change detection strategies to lazy loading.',
    body: `Performance isn't something you bolt on at the end. It's baked into every decision you make — from component architecture to how you load data.\n\nAfter spending months optimising Angular applications in production, here are the techniques that made the biggest difference:\n\n**OnPush Change Detection**\nSwitching components to \`ChangeDetectionStrategy.OnPush\` was the single biggest performance win. It tells Angular to only re-render when inputs change or signals update, drastically reducing unnecessary checks.\n\n**Lazy Loading Routes**\nEvery route in my app uses \`loadComponent\` to lazy-load. This keeps the initial bundle small and loads code on demand.\n\n**TrackBy in Loops**\nUsing \`track\` in \`@for\` blocks prevents Angular from re-creating DOM elements when the underlying data hasn't changed.\n\n**Virtual Scrolling**\nFor large lists, the CDK's virtual scroll viewport renders only visible items. This turned a janky 10,000-item list into a smooth experience.\n\n**Preloading Strategies**\nAngular's \`PreloadAllModules\` strategy loads lazy routes in the background after the initial page loads. Users get instant navigation without a larger initial bundle.\n\n**Bundle Analysis**\nRunning \`ng build --stats-json\` and analysing the output with webpack-bundle-analyzer revealed surprising bloat from unused imports.\n\nThe takeaway: measure before you optimise, but build with performance in mind from the start.`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  },
  {
    title: 'The Art of Writing Clean, Readable Code',
    author: 'Matt King',
    date: '2025-11-08',
    tags: ['Clean Code', 'Best Practices', 'Career'],
    excerpt: `Code is read far more often than it's written. Here's how I approach writing code that future-me will thank present-me for.`,
    body: `Every developer has opened a file they wrote six months ago and thought, "What was I thinking?" It's a universal experience — and it's avoidable.\n\nClean code isn't about following rigid rules. It's about empathy for the next person who reads your code (including future you). Here's what I've learned:\n\n**Name things for humans.** \`getUserById\` is better than \`getU\`. \`isAuthenticated\` is better than \`authFlag\`. Spend the extra seconds choosing descriptive names.\n\n**Keep functions small.** If a function does more than one thing, split it. Small functions are easier to test, reuse, and understand.\n\n**Avoid clever code.** That one-liner ternary chain might feel brilliant today, but it'll be a puzzle tomorrow. Write for clarity, not cleverness.\n\n**Comments explain "why", not "what".** If your code needs a comment to explain what it does, it should probably be refactored. Save comments for explaining _why_ a decision was made.\n\n**Consistent formatting matters.** Use Prettier or ESLint. Don't waste mental energy on tabs vs. spaces — automate it and move on.\n\n**Delete dead code.** If it's commented out, it's dead. Git remembers everything; you don't need to.\n\nThe goal isn't perfection. It's writing code that's easy to change, easy to understand, and easy to trust.`,
    coverImage: 'https://images.unsplash.com/photo-1515879218367-8466d910auj9?w=800&q=80',
  },
];

const COMMENTS = [
  { postTitle: 'Building a Liquid Glass UI with Angular', author: 'Sarah Chen', email: 'sarah.chen@example.com', body: 'Fantastic write-up! The layered shadow technique really makes the glass effect pop. Going to try this on my next project.' },
  { postTitle: 'Building a Liquid Glass UI with Angular', author: 'James Wright', email: '', body: "Great point about performance fallbacks. I've seen backdrop-filter tank FPS on older Android devices — the @supports approach is solid." },
  { postTitle: 'Building a Liquid Glass UI with Angular', author: 'Priya Patel', email: 'priya@designstudio.io', body: 'Would love to see a follow-up on animating glass elements. Transitions between states could be really slick.' },
  { postTitle: 'My Journey Into Full-Stack Development', author: 'Alex Turner', email: '', body: 'This resonates so much. The jump from front-end to full-stack feels huge at first, but it really does click over time.' },
  { postTitle: 'My Journey Into Full-Stack Development', author: 'Mia Johansson', email: 'mia.j@devmail.com', body: "Completely agree on Docker. It changed my entire workflow. Wish I'd started using it earlier." },
  { postTitle: 'Why I Chose Angular Over React for My Portfolio', author: 'David Kim', email: '', body: "Refreshing take! The signals point is underrated — they're so much simpler than useEffect chains." },
  { postTitle: 'Why I Chose Angular Over React for My Portfolio', author: "Liam O'Brien", email: 'liam@webdevpro.com', body: "As someone who uses both daily, this is a fair comparison. Angular's DI alone is worth the learning curve." },
  { postTitle: 'Designing for Accessibility Without Sacrificing Aesthetics', author: 'Emma Nakamura', email: 'emma.n@a11y.org', body: 'Thank you for this. Accessibility should never be an afterthought. The focus-state tip is something more designers need to hear.' },
  { postTitle: 'Designing for Accessibility Without Sacrificing Aesthetics', author: 'Carlos Ruiz', email: '', body: 'The skip-to-content pattern is so easy to implement and makes such a big difference. Great list.' },
  { postTitle: 'Optimising Angular Performance: Lessons from Production', author: 'Sophie Laurent', email: 'sophie@perf.dev', body: 'OnPush + signals is a game-changer. Saw a 40% reduction in change detection cycles on our app after switching.' },
  { postTitle: 'Optimising Angular Performance: Lessons from Production', author: 'Ryan Zhao', email: '', body: 'Bundle analysis is so underrated. Found 200kB of unused lodash functions hiding in our build. Ouch.' },
  { postTitle: 'The Art of Writing Clean, Readable Code', author: 'Olivia Barnes', email: 'olivia@cleancode.io', body: '"Comments explain why, not what" — I say this in every code review. Going to start linking this post instead.' },
  { postTitle: 'The Art of Writing Clean, Readable Code', author: 'Noah Fischer', email: '', body: `The "delete dead code" point hits hard. I've been guilty of leaving commented code "just in case" way too many times.` },
];

// ── Portfolio Projects ──────────────────────────────────────
const PROJECTS = [
  {
    title: 'Liquid Glass Dashboard',
    description: 'A real-time analytics dashboard built with Angular and D3.js featuring a frosted-glass design system.',
    tags: ['Angular', 'D3.js', 'SCSS', 'Dashboard'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80'],
    liveUrl: 'https://example.com/dashboard',
    repoUrl: 'https://github.com/example/dashboard',
    body: 'This project was an exploration of glassmorphism applied to data-heavy interfaces. The challenge was keeping the UI beautiful while displaying dense, real-time analytics data.\n\nKey features include:\n- **Live data streaming** via WebSockets with graceful reconnection logic\n- **Custom D3.js charts** that animate fluidly on data updates\n- **Responsive grid layout** that adapts from desktop to mobile\n- **Dark/light theme toggle** that preserves the glass aesthetic in both modes',
    date: '2026-01-15',
  },
  {
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce application with payment processing, inventory management, and admin panel.',
    tags: ['Angular', 'Node.js', 'PostgreSQL', 'Stripe'],
    coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80'],
    liveUrl: 'https://example.com/shop',
    repoUrl: 'https://github.com/example/shop',
    body: 'Building an e-commerce platform from scratch taught me more about software architecture than any course ever could.\n\nThe stack: Angular on the front-end, Node.js + Express for the API, PostgreSQL for data, and Stripe for payments.',
    date: '2025-12-20',
  },
  {
    title: 'Weather Visualisation App',
    description: 'An interactive weather app that visualises forecasts using animated SVG maps and charts.',
    tags: ['Angular', 'SVG', 'API Integration', 'Animation'],
    coverImage: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80', 'https://images.unsplash.com/photo-1530908295418-a12e326966ba?w=800&q=80'],
    liveUrl: '',
    repoUrl: 'https://github.com/example/weather',
    body: 'This project combines API integration with creative data visualisation. Weather data from OpenWeatherMap is transformed into beautiful, animated displays.',
    date: '2025-11-05',
  },
  {
    title: 'Task Management System',
    description: 'A Kanban-style project management tool with drag-and-drop, real-time collaboration, and calendar views.',
    tags: ['Angular', 'Firebase', 'CDK Drag-Drop', 'Real-time'],
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80'],
    liveUrl: 'https://example.com/tasks',
    repoUrl: 'https://github.com/example/tasks',
    body: 'Inspired by Trello and Linear, this project management tool was built to learn real-time collaboration patterns.',
    date: '2025-10-12',
  },
  {
    title: 'AI Chat Interface',
    description: 'A conversational AI interface with streaming responses, code highlighting, and conversation history.',
    tags: ['Angular', 'OpenAI API', 'Server-Sent Events', 'Markdown'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80', 'https://images.unsplash.com/photo-1676299081847-824916de030a?w=800&q=80'],
    liveUrl: '',
    repoUrl: 'https://github.com/example/ai-chat',
    body: 'Building a ChatGPT-like interface taught me about streaming data, markdown rendering, and complex state management.',
    date: '2025-09-28',
  },
  {
    title: 'Music Streaming Prototype',
    description: 'A Spotify-inspired music player with waveform visualisation and collaborative playlists.',
    tags: ['Angular', 'Web Audio API', 'Canvas', 'WebSocket'],
    coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'],
    liveUrl: '',
    repoUrl: 'https://github.com/example/music',
    body: 'This prototype explores the Web Audio API and Canvas for creating an immersive music experience.',
    date: '2025-08-15',
  },
  {
    title: 'Fitness Tracker Dashboard',
    description: 'A personal fitness dashboard that syncs with wearable devices and displays workout analytics.',
    tags: ['Angular', 'Chart.js', 'REST API', 'PWA'],
    coverImage: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'],
    liveUrl: 'https://example.com/fitness',
    repoUrl: '',
    body: 'A progressive web app that turns raw fitness data into actionable insights.',
    date: '2025-07-20',
  },
  {
    title: 'Real Estate Listings Platform',
    description: 'A property search platform with interactive maps, virtual tours, and saved search alerts.',
    tags: ['Angular', 'Mapbox', 'Elasticsearch', 'Node.js'],
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'],
    liveUrl: '',
    repoUrl: 'https://github.com/example/realestate',
    body: 'Combining map-based browsing with powerful search made this one of the most complex front-end projects I have tackled.',
    date: '2025-06-10',
  },
  {
    title: 'Recipe Sharing Community',
    description: 'A social platform for sharing, discovering, and organising recipes with meal planning features.',
    tags: ['Angular', 'Firebase', 'Cloud Functions', 'Social'],
    coverImage: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80', 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80'],
    liveUrl: 'https://example.com/recipes',
    repoUrl: 'https://github.com/example/recipes',
    body: 'A full social platform centred around food — this project pushed my skills in user-generated content management and social features.',
    date: '2025-05-01',
  },
];

// ── Run seed ────────────────────────────────────────────────
function seed() {
  console.log('Seeding database...');

  // Clear existing data
  db.exec('DELETE FROM comments');
  db.exec('DELETE FROM blog_posts');
  db.exec('DELETE FROM projects');

  // Insert blog posts
  const insertPost = db.prepare(
    `INSERT INTO blog_posts (title, author, date, tags, excerpt, body, cover_image)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const postIds = {};
  const insertPosts = db.transaction(() => {
    for (const post of POSTS) {
      const result = insertPost.run(
        post.title,
        post.author,
        post.date,
        JSON.stringify(post.tags),
        post.excerpt,
        post.body,
        post.coverImage
      );
      postIds[post.title] = result.lastInsertRowid;
    }
  });
  insertPosts();
  console.log(`  Inserted ${POSTS.length} blog posts`);

  // Insert comments
  const insertComment = db.prepare(
    'INSERT INTO comments (post_id, author, email, body) VALUES (?, ?, ?, ?)'
  );
  const insertComments = db.transaction(() => {
    for (const comment of COMMENTS) {
      const postId = postIds[comment.postTitle];
      if (postId) {
        insertComment.run(postId, comment.author, comment.email || '', comment.body);
      }
    }
  });
  insertComments();
  console.log(`  Inserted ${COMMENTS.length} comments`);

  // Insert projects
  const insertProject = db.prepare(
    `INSERT INTO projects (title, description, tags, cover_image, images, live_url, repo_url, body, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const insertProjects = db.transaction(() => {
    for (const proj of PROJECTS) {
      insertProject.run(
        proj.title,
        proj.description,
        JSON.stringify(proj.tags),
        proj.coverImage,
        JSON.stringify(proj.images),
        proj.liveUrl || '',
        proj.repoUrl || '',
        proj.body,
        proj.date
      );
    }
  });
  insertProjects();
  console.log(`  Inserted ${PROJECTS.length} portfolio projects`);

  console.log('Seeding complete!');
}

seed();
