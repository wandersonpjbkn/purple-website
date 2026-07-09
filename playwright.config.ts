import { defineConfig, devices } from '@playwright/test'

// e2e smoke: navigates the 6 menu pages against a real dev stack (frontend +
// blog Worker with real R2 content via --remote). Contact form submission is
// mocked in the spec — VITE_CONTACT_API_URL points at the production mail
// Worker, so the real endpoint must never be hit from tests.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'yarn dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'yarn --cwd workers/blog dev --remote',
      url: 'http://localhost:8787/index',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
})
