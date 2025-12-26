# AI Enrichment System

This document describes the AI-powered enrichment features for the Distractions Viewer.

## Overview

When a new link is saved to the Coda table, we use Claude to:
1. Generate a descriptive title (if the source doesn't have one)
2. Assign a category for the icon pill
3. Select the best image URL

## Implementation Options

### Option A: n8n Webhook Workflow (Recommended)

Create an n8n workflow triggered when saving a new link:

1. **Trigger**: Webhook receives new URL
2. **Fetch**: Get page metadata (title, OG image, description)
3. **Claude**: Analyze and enrich
4. **Coda**: Update the row with enriched data

### Option B: Next.js API Route

Create `/api/enrich` endpoint that:
1. Receives a URL
2. Fetches page metadata
3. Calls Claude API for categorization
4. Returns enriched data

## Claude Prompt for Categorization

```
Analyze this URL and its metadata to categorize it.

URL: {url}
Title: {title}
Description: {description}

Choose ONE category from:
- ai (AI tools, models, research)
- video (YouTube, streaming, video content)
- social (Social media, community sites)
- news (News sites, journalism)
- dev (Developer tools, code, programming)
- design (Design tools, inspiration, portfolios)
- music (Music streaming, production, artists)
- photo (Photography sites, image galleries)
- tools (Utilities, productivity tools)
- shopping (E-commerce, product sites)
- learning (Education, tutorials, courses)
- productivity (Task management, organization)
- other (Doesn't fit other categories)

Respond with ONLY the category key (e.g., "ai" or "video").
```

## Image Selection Logic

Priority order for selecting card images:

1. **YouTube thumbnail** (if youtube.com or youtu.be URL)
   - Extract video ID
   - Use `https://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg`

2. **Open Graph image** (og:image meta tag)
   - Most sites provide this for social sharing

3. **Twitter card image** (twitter:image meta tag)
   - Fallback if no OG image

4. **First large image on page**
   - Scrape page for images > 300px wide

5. **Generated placeholder**
   - Domain-based placeholder as last resort

## Coda Schema Updates

Add these columns to the Distractions table:

| Column | Type | Purpose |
|--------|------|--------|
| Category | Select | AI-assigned category |
| AI_Title | Text | Generated title (if needed) |
| AI_Image_URL | URL | Resolved image URL |
| Enriched | Checkbox | Whether AI processing is complete |

## Example n8n Workflow

```json
{
  "trigger": "webhook",
  "steps": [
    {
      "name": "Fetch Page Metadata",
      "type": "HTTP Request",
      "url": "{{$json.url}}",
      "extract": ["title", "og:image", "og:description"]
    },
    {
      "name": "Claude Categorization",
      "type": "Anthropic",
      "model": "claude-sonnet-4-20250514",
      "prompt": "[categorization prompt]"
    },
    {
      "name": "Update Coda Row",
      "type": "Coda",
      "action": "Update Row",
      "data": {
        "Category": "{{$json.category}}",
        "AI_Image_URL": "{{$json.imageUrl}}",
        "Enriched": true
      }
    }
  ]
}
```

## API Keys Required

- **ANTHROPIC_API_KEY**: For Claude API calls
- **CODA_API_TOKEN**: For reading/writing to Coda
