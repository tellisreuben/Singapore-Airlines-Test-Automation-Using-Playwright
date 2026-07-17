import { test as base, expect } from '@playwright/test';
import { homePage } from '../helpers/fixtures/homePage';

type homePageFixture = {_homePage: homePage;};

export const test = base.extend<homePageFixture>({
    _homePage: async({page}, use) => {
        const _homePage = new homePage(page);
        await use(_homePage);
    }
})

test.describe('Test booking flights',() =>{

    test('Book a flight from Sydney to Singapore',
        {tag: '@bookflights'},
        async({_homePage}) =>{
             await _homePage.goto();
             await _homePage.fillOriginAndDestinationPlaces('Sydney','Blr');
             //await _homePage.verifyOriginAndDestinationControlsVisible();
    })
});