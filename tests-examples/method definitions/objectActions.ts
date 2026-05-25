import { test, expect } from '@playwright/test';

function getLocatorById(page, id) {
  return page.locator(`#${id}`);
}

function clickElement(locator, timeout = 5000) {
    return locator.waitFor({ state: 'visible', timeout }).then(() => locator.click(timeout));
}

function waitForElementToBeVisible(locator, timeout = 5000) {
    return locator.waitFor({ state: 'visible', timeout });
}

function getElementWithText(page, textToCompare: string , timeout? : number) {
   const elements = page.locator('div').waitForElementToBeVisible();
   let elem, text;
   if (!timeout) {
       timeout = process.env.DEFAULT_TIMEOUT ? parseInt(process.env.DEFAULT_TIMEOUT) : 5000     ;
   }    
   // Assuming elements is iterable, otherwise you may need to await elements.all() or similar
   // If elements is a Locator, use locator.allTextContents() or similar Playwright API
   // Here's an example using Playwright's allTextContents:
   return elements.allTextContents().then((element: Element[]) => {
       for (const e of elements) {
           console.log('Element text: ', e.textContent());
           console.log(e);
           if (e.textContent().trim() === textToCompare) {
               text = e.textContent().trim();
               elem = e
               break;
           }
       }    
       return elem;
   });
}

export const objectActions = {
  clickElement,
  getElementWithText,
  waitForElementToBeVisible
};