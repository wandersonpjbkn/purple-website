# Worker :: Blog

## Install

```bash
cd workers/blog

yarn install

yarn wrangler secret put BLOG_DEPLOY_TOKEN

yarn wrangler secret put RENDER_DEPLOY_HOOK

yarn wrangler deploy
```
