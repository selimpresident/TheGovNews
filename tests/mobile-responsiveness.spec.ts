import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test('Landing page renders correctly on mobile', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone 8
    
    // Navigate to the app
    await page.goto('/');
    
    // Check if mobile navigation is visible
    const mobileNav = await page.$('.fixed.bottom-0');
    expect(mobileNav).not.toBeNull();
    
    // Check if map is properly sized
    const map = await page.$('svg.rsm-svg');
    const mapBounds = await map?.boundingBox();
    expect(mapBounds?.width).toBeLessThanOrEqual(375);
    
    // Check if header adapts to mobile
    const headerButtons = await page.$$('header button span');
    for (const button of headerButtons) {
      const isVisible = await button.isVisible();
      const text = await button.textContent();
      if (text && text.length > 1) {
        // Text labels should be hidden on mobile
        expect(isVisible).toBeFalsy();
      }
    }
  });
  
  test('Touch targets are at least 44x44px', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to the app
    await page.goto('/');
    
    // Check all buttons
    const buttons = await page.$$('button');
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});