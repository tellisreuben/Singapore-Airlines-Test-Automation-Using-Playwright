import { test, expect, Locator} from '@playwright/test';
import { objectActions } from '../tests-examples/method definitions/objectActions';
const { clickElement, getElementWithText } = objectActions;


test('Login into Singapore Airlines', {tag: '@homePage'}, async ({ page }) => {
  await page.goto(process.env.BASE_URL?? 'https://www.google.com', { waitUntil: 'networkidle' });

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('Singapore Airlines Official Website | Book International Flight Tickets');
  const allButtons = await page.getByRole('button').allTextContents();
  const allLinks = await page.getByRole('link').allTextContents();
  //console.log('Buttons:', allButtons);
  //console.log('Links:', allLinks);
  const LogInbtn = page.getByRole('button', { name: 'Log in to access your account' });//Login button on the homepage top right corner
 
  await LogInbtn.waitFor({ state: 'visible', timeout: 60000 });

  await LogInbtn.click();
  await page.getByRole("radio", { name: 'KrisFlyer/PPS Club' }).click();
  console.log('Username is =' + process.env.TEST_USERNAME);
  await page.getByLabel('krisflyernumber').fill(process.env.TEST_USERNAME ?? 'abc');
  await page.getByLabel('password').fill(process.env.TEST_PASSWORD ?? 'password');
  await LogInbtn.waitFor({ state: 'visible', timeout: 60000 });
  await page.locator('#loginDetailsSection').getByRole('button', { name: 'Log in' }).click();
  //await getElementWithText(this, 'KrisFlyer/PPS Club', 20000).clickElement(this);
});



