# Deployment Guide for MediX

## Quick Start

### 1. Prepare Supabase
- Supabase database is already set up with all tables and RLS policies
- Environment variables are configured in `.env`

### 2. Install & Build
```bash
npm install
npm run build
```

### 3. Run Locally
```bash
npm run dev
```
Visit http://localhost:5173

## Deployment Options

### Option A: Vercel (Recommended)
1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy (automatic on push)

### Option B: Netlify
1. Push code to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables in Netlify dashboard
6. Deploy

### Option C: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

Build: `docker build -t medix .`
Run: `docker run -p 5173:5173 medix`

### Option D: Traditional Server
1. Build: `npm run build`
2. Copy `dist/` folder to your server
3. Serve with Nginx/Apache as static files

## Environment Setup

Create `.env.production` for production:
```
VITE_SUPABASE_URL=https://your-production-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-key
```

## Database Backups

Supabase automatically backs up your database. Access backups in:
1. Supabase Dashboard
2. Settings → Backups
3. Download or restore as needed

## Monitoring

Track usage in:
- Supabase Dashboard → Usage
- Monitor real-time queries and storage
- Set up alerts for quota limits

## Troubleshooting

### Build fails with "out of memory"
- Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

### CORS errors
- All Supabase endpoints allow CORS from any domain (configured)
- Verify `VITE_SUPABASE_URL` is correct

### Authentication not working
- Check `.env` variables are loaded
- Verify Supabase project is active
- Clear browser cache and cookies

### Database connection errors
- Verify Supabase credentials
- Check database status in Supabase Dashboard
- Ensure RLS policies are not blocking queries

## Performance Tips

1. Database indexes are automatically created on foreign keys
2. Queries use `.select()` efficiently (only fetch needed columns)
3. Use `.maybeSingle()` for single-row queries to avoid errors
4. Browser caching handled by Vite (cache-busting with hash)

## Security Checklist

- [ ] Never commit `.env` with real keys
- [ ] Rotate secrets regularly
- [ ] Enable 2FA on Supabase account
- [ ] Review RLS policies quarterly
- [ ] Monitor audit logs in Supabase
- [ ] Use HTTPS only (enforced by Vercel/Netlify)
- [ ] Set up database backups
- [ ] Review CORS settings if needed

## Next Steps

1. Test fully before going live
2. Set up monitoring and alerts
3. Plan maintenance windows
4. Document admin procedures
5. Train support team on features
