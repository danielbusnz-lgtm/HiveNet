import { test, expect } from '@playwright/test'

test('user can like and unlike their own post', async ({ page }) => {
    const ts = Date.now()
    const username = `t${ts}`
    const email = `t${ts}@example.com`
    const password = 'pw_test_123'
    const postContent = `Likes test ${ts}`

    await page.goto('/register')
    await page.getByLabel('Username').fill(username)
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Create account' }).click()

    await page.goto('/login')
    await page.getByLabel('Username').fill(username)
    await page.getByLabel('Password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForURL('/')

    await page.getByLabel(/what's on your mind/i).fill(postContent)
    await page.getByRole('button', { name: 'Post' }).click()

    const likeButton = page.locator('button[aria-pressed]').first()
    await expect(likeButton).toBeVisible()
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false')
    await expect(likeButton).toContainText('0')

    await likeButton.click()
    await expect(likeButton).toHaveAttribute('aria-pressed', 'true')
    await expect(likeButton).toContainText('1')

    await likeButton.click()
    await expect(likeButton).toHaveAttribute('aria-pressed', 'false')
    await expect(likeButton).toContainText('0')
})
