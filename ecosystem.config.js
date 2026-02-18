module.exports = {
  apps: [
    {
      name: 'portfolio-backend',
      script: './server.js',
      cwd: './server',
      instances: 'max',
      exec_mode: 'cluster',

      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 3001
      },
      
      watch: false,
      
      ignore_watch: [
        'node_modules',
        'uploads',
        'data',
        'logs',
        '.env'
      ],
      
      max_memory_restart: '500M',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      kill_timeout: 5000,
      listen_timeout: 3000,
      
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      merge_logs: true,
      disable_logs: false,
      error_file: './logs/error.log',
    }
  ],
  
  deploy: {
    production: {
      user: 'node',
      host: '68.66.251.137',
      ref: 'origin/main',
      repo: 'https://github.com/MattKingUk/PortfolioWebsite.git',
      path: '/var/www/portfolio',
      'post-deploy': 'npm install && npm run build && pm2 restart ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production"'
    },
    staging: {
      user: 'node',
      host: 'staging-server-ip',
      ref: 'origin/staging',
      repo: 'https://github.com/MattKingUk/PortfolioWebsite.git',
      path: '/var/www/portfolio-staging',
      'post-deploy': 'npm install && npm run build && pm2 restart ecosystem.config.js --env staging'
    }
  }
};
