# Distractions Viewer

A Next.js application for displaying curated links/distractions in a beautiful masonry card layout. Data is sourced from Coda and enriched with AI-generated titles, categories, and images via Anthropic's Claude API.

## Features

- **Responsive masonry layout**: Single column on mobile, 3 columns on desktop
- **Smart card design**: Image with category icon pill overlay, title below
- **AI-powered enrichment**: 
  - Auto-generated titles when source doesn't provide one
  - Category assignment via LLM analysis
  - Smart image selection (YouTube thumbnails, Open Graph images, etc.)
- **Real-time data**: Fetches from Coda API, filters to show only "Live" items
- **Deep linking**: Cards open links directly, resolving to appropriate apps

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome (Free + Brands)
- **Data Source**: Coda API
- **AI Enrichment**: Anthropic Claude API
- **Deployment**: DigitalOcean (via Docker)

## Data Structure

Source: Coda table "Distractions | Regulars | Browsing"

| Field | Type | Usage |
|-------|------|-------|
| Name | text | Card title (fallback to AI-generated) |
| Link | url | Destination URL |
| Image | image | Card thumbnail |
| Scale | 1-5 stars | Not displayed, for filtering |
| Status | Live/Archived | Only "Live" items shown |
| Category | text (TBD) | For icon pill overlay |
| AI_Title | text (TBD) | LLM-generated title |
| AI_Image_URL | url (TBD) | LLM-selected image URL |

## Card Design

```
┌─────────────────────────┐
│  ┌──────┐               │
│  │ icon │               │  ← Category pill (top-left)
│  └──────┘               │
│                         │
│       [IMAGE]           │  ← Main image area
│                         │
├─────────────────────────┤
│  Title of the Link      │  ← Title area
│  domain.com · 2h ago    │  ← Source + time
└─────────────────────────┘
```

## Development Roadmap

### Phase 1: Basic Viewer ✨
- [ ] Next.js project setup
- [ ] Coda API integration
- [ ] Masonry layout with CSS Grid
- [ ] Basic card component
- [ ] Deploy to DigitalOcean

### Phase 2: AI Enrichment 🤖
- [ ] Add Category column to Coda
- [ ] Claude API integration for categorization
- [ ] Title generation for untitled links
- [ ] Smart image URL extraction

### Phase 3: Polish 💅
- [ ] Font Awesome icon mapping
- [ ] Loading states
- [ ] Error handling
- [ ] Image optimization

## Environment Variables

```env
CODA_API_TOKEN=your-coda-token
ANTHROPIC_API_KEY=your-anthropic-key
```

## Local Development

```bash
npm install
npm run dev
```

## Deployment

Deployed to DigitalOcean droplet via Docker. See `/docs/deployment.md` for details.

## Related Infrastructure

- **n8n Host**: 157.245.179.100 (workflow automation)
- **MCP Host**: 142.93.25.24 (MCP servers)
- **DNS**: Managed via Cloudflare

## License

Private - Ted Pearlman / Listen to the Trees
