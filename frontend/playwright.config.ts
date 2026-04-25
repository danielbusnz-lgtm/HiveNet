import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './e2e',
    fullyParallel: false,
    workers: 1,
    retries: 0,
    reporter: 'list',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'retain-on-failure',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: [
        {
            command: 'uv run uvicorn app.main:app --port 8000',
            cwd: '../backend',
            url: 'http://localhost:8000/docs',
            reuseExistingServer: true,
            timeout: 60_000,
        },
        {
            command: 'npm run dev',
            url: 'http://localhost:3000/login',
            reuseExistingServer: true,
            timeout: 120_000,
        },
    ],
})
