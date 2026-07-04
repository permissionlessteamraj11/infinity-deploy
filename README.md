# EliteHosting - VPS Deployment Guide

This guide explains how to deploy this TanStack Start application on a VPS (Ubuntu/Debian) using Nginx and PM2.

## 1. Prerequisites

- A VPS with Node.js (v18+) and Bun/NPM installed.
- Nginx installed.
- Domain name pointed to your VPS IP.

## 2. Prepare the Application

Clone your repository and install dependencies:

```bash
git clone <your-repo-url>
cd elitehosting
bun install # or npm install
```

Build the application:

```bash
bun run build # or npm run build
```

## 3. Deployment with PM2

Install PM2 globally:

```bash
npm install -g pm2
```

Start the application:

```bash
pm2 start "bun run start" --name elitehosting
# or if using npm
pm2 start "npm run start" --name elitehosting
```

To make PM2 start on boot:

```bash
pm2 save
pm2 startup
```

## 4. Nginx Configuration (Fixes "Page Not Found" on Refresh)

When using client-side routing (like TanStack Router), refreshing the page on any sub-path (e.g., `/pricing`) will result in a 404 error from Nginx because it tries to find a physical file at that path.

To fix this, you must configure Nginx to proxy all requests to your Node.js server.

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/elitehosting
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com; # Replace with your domain

    location / {
        proxy_pass http://localhost:3000; # TanStack Start default port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # This line ensures that all requests are handled by the app
        try_files $uri $uri/ @proxy;
    }

    location @proxy {
        proxy_pass http://localhost:3000;
    }
}
```

Enable the configuration and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/elitehosting /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 5. SSL with Certbot (Optional but Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Troubleshooting "Page Not Found"

If you are still seeing "Page Not Found", ensure that:

1. Your Nginx `proxy_pass` is pointing to the correct port where your app is running.
2. You have restarted the app after making changes.
3. Your Nginx configuration is correctly handling fallbacks.
