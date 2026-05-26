# Singapore Airlines Login Test Plan

## Overview
This test plan verifies that the Singapore Airlines base URL (loaded from `.env.staging`) is reachable and that a KrisFlyer/PPS Club user can successfully log in using credentials sourced from `.env.staging`. The plan includes explicit assertions to confirm the logged-in state.

## Environment & Configuration

| Item | Value / Source |
|---|---|
| Environment file | `.env.staging` |
| Base URL | `process.env.BASE_URL` (e.g. `https://www.singaporeair.com/`) |
| Username | `process.env.TEST_USERNAME` |
| Password | `process.env.TEST_PASSWORD` |
| Loader | `dotenv` configured in [playwright.config.ts](../playwright.config.ts) when `NODE_ENV !== 'production'` |
| Target file | [tests/HomePage.spec.ts](../tests/HomePage.spec.ts) (or new spec under `tests/`) |
| Tag | `@homePage`, `@login`, `@smoke` |

## Pre-conditions
1. `.env.staging` is present at the project root with `BASE_URL`, `TEST_USERNAME`, and `TEST_PASSWORD` populated.
2. `NODE_ENV` is unset or not equal to `production` so that `.env.staging` is loaded.
3. Test account is a valid, active KrisFlyer/PPS Club member that is not locked out.
4. Network access to `singaporeair.com` is available from the test runner.

## Test Suite: Singapore Airlines Login

### Test 1: Base URL is reachable and renders the home page

**Objective:** Confirm the base URL from `.env.staging` loads successfully before attempting login.

**Steps:**
1. Read `BASE_URL` from environment.
2. Navigate to `BASE_URL` with `waitUntil: 'networkidle'`.

**Assertions:**
- `process.env.BASE_URL` is defined and not an empty string.
- HTTP response status is `200` (capture via `page.goto` return value).
- `page` URL matches the configured `BASE_URL` (allowing for a trailing slash or locale redirect).
- Page title equals `Singapore Airlines Official Website | Book International Flight Tickets`.
- The top-right **Log in to access your account** button is visible.

---

### Test 2: Successful login with KrisFlyer/PPS Club credentials

**Objective:** Authenticate a known KrisFlyer member using credentials from `.env.staging` and verify the user reaches a logged-in state.

**Pre-conditions:** Test 1 passes; credentials are set in env.

**Steps:**
1. Navigate to `BASE_URL`.
2. Click the **Log in to access your account** button in the top-right corner.
3. Select the **KrisFlyer/PPS Club** radio option.
4. Fill the `krisflyernumber` field with `process.env.TEST_USERNAME`.
5. Fill the `password` field with `process.env.TEST_PASSWORD`.
6. Click the **Log in** button inside `#loginDetailsSection`.
7. Wait for the post-login navigation / network to be idle.

**Assertions (logged-in state):**
- `process.env.TEST_USERNAME` and `process.env.TEST_PASSWORD` are defined and non-empty before the test runs.
- The login dialog / `#loginDetailsSection` is no longer visible after submission.
- The top-right **Log in to access your account** button is no longer visible (it is replaced by the member menu).
- A member-greeting / account element is visible (e.g. an element containing the member's first name, the KrisFlyer number, or the text `Log out`).
- A `Log out` control is available within the account menu (proves session is established).
- At least one authenticated cookie is set on the `singaporeair.com` domain after login (non-empty cookie jar that includes a session cookie such as one whose name contains `SESSION`, `JSESSIONID`, or `Auth`).
- No visible error banner / inline error message such as `Invalid`, `incorrect`, or `try again` is present on the page.

---

### Test 3: Login fails fast when credentials env vars are missing (negative guard)

**Objective:** Ensure the test suite does not silently fall back to dummy credentials when `.env.staging` is not loaded.

**Steps:**
1. In a separately scoped test (or `beforeAll`), assert that all three env vars exist.

**Assertions:**
- `expect(process.env.BASE_URL).toBeTruthy()`
- `expect(process.env.TEST_USERNAME).toBeTruthy()`
- `expect(process.env.TEST_PASSWORD).toBeTruthy()`
- `process.env.TEST_USERNAME` is not the literal placeholder `abc`.
- `process.env.TEST_PASSWORD` is not the literal placeholder `password`.

---

## Post-conditions
- Browser context is closed after each test (Playwright default).
- No leftover storage state is persisted between tests (unless `storageState` is intentionally introduced later for reuse).

## Risks & Notes
- Singapore Airlines may present a cookie/consent banner, geo-redirect, or CAPTCHA on first load — these may need dismissal or handling before the login button is clickable.
- The DOM selectors (`krisflyernumber`, `password`, `#loginDetailsSection`) are based on the current production site and may change; update locators if the site is redesigned.
- Real credentials live in `.env.staging` which is git-ignored — never commit this file or log the password value.
- Use Playwright's `--project=chromium` first when iterating; full cross-browser run should be a separate CI job.

## Execution

```bash
# default (loads .env.staging)
npx playwright test tests/HomePage.spec.ts --project=chromium

# headed for debugging
npx playwright test tests/HomePage.spec.ts --project=chromium --headed

# only the login-tagged tests
npx playwright test --grep @login
```
