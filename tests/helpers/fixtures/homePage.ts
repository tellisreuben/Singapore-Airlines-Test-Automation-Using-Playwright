import { type Page, type Locator, expect } from '@playwright/test';


export class homePage{

private  readonly fromCity: Locator;
private readonly toCity: Locator;
constructor(public readonly page: Page){
     this.fromCity = this.page.locator('#flightOrigin1');
     this.toCity = this.page.locator('#bookFlightDestination')
}

async goto(){
     await this.page.goto('/');
}

async verifyOriginAndDestinationControlsVisible(){
     await expect(this.fromCity).toBeVisible();
     await expect(this.toCity).toBeVisible();
}

async fillOriginAndDestinationPlaces(origin: string, destination: string){
     this.verifyOriginAndDestinationControlsVisible();
     await this.fromCity.fill(origin);
     await this.toCity.fill(destination);
}
// Add any other methods or page functions over here

}
