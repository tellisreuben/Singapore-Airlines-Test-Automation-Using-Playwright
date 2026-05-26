This is a test automation project to automate the workflow on the Singapore Airlines website. As per normal workflow,
the user logs in and checks for tickets for a specific destination. The test framework attempts to do the same. 

The tools used are Playwright and Github Actions. 

I have attempted to use Playwright's agents to automatically generate a test plan, test cases and heal erroneous tests.

If you are using this project, please create a .env.staging file and please include the below

```
BASE_URL="https://www.singaporeair.com/"
TEST_USERNAME="_your_username"
TEST_PASSWORD="_your_password"
```

Compile this code using the below in the command line
```
Node_Env=staging npx playwright test --ui --project=firefox
```

