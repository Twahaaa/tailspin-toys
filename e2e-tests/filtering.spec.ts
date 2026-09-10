import { test, expect } from '@playwright/test';

test.describe('Game catalog filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('filters by category and publisher together', async ({ page }) => {
    await page.getByTestId('category-filter').selectOption({ label: 'Strategy' });
    await page.getByTestId('publisher-filter').selectOption({ label: 'CodeForge Studios' });
    await page.getByTestId('apply-filters').click();

    await expect(page).toHaveURL(/category=1/);
    await expect(page).toHaveURL(/publisher=1/);
    await expect(page.locator('[data-testid="game-card"]:visible')).toHaveCount(1);
    await expect(page.locator('[data-testid="game-card"]:visible').first()).toContainText('DevOps Dominion');
  });

  test('supports multiple category selections', async ({ page }) => {
    await page.getByTestId('category-filter').selectOption([{ label: 'Puzzle' }, { label: 'Strategy' }]);
    await page.getByTestId('apply-filters').click();

    await expect(page.locator('[data-testid="game-card"]:visible')).toHaveCount(8);
    await expect(page).toHaveURL(/category=2.*category=1|category=1.*category=2/);
  });

  test('shows an empty state when filters have no matches', async ({ page }) => {
    await page.goto('/?category=1&publisher=99999');

    await expect(page.locator('[data-testid="game-card"]:visible')).toHaveCount(0);
    await expect(page.getByTestId('filtered-empty-state')).toBeVisible();
    await expect(page.getByTestId('filtered-empty-state')).toContainText('No games match the selected filters.');
  });
});
