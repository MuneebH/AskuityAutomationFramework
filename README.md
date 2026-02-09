# Playwright E2E Test Framework

This project contains end-to-end tests written using Playwright. This project includes one test file that executes a flow of filtering products, adding products to cart, and validating the cart functionality and UI.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)
- [Playwright](https://playwright.dev/docs/intro)

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MuneebH/AskuityAutomationFramework.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd askuityautomationframework
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

## Running the Tests

To run the tests, execute the following command from the root of the project:

```bash
npx playwright test tests/shoppingCart.spec.ts
```

This command will start the Playwright test runner with the three main browsers, Chrome, Firefox, Desktop Safari, which will execute the spec files located in the `src/tests` directory.

---

## Design decisions

- **Playwright Test runner:** Chosen for its built-in test runner features (parallelism, retries, fixtures, and reporters) which reduce CI complexity.
- **Page Object Pattern:** Pages live under `src/pages` to encapsulate selectors and actions, keeping test specs focused on behavior.
- **Deterministic waits:** Prefer Playwright's auto-waiting and explicit checks over arbitrary sleeps to make tests reliable.
- **Parallel, isolated tests:** Tests are written to be independent so Playwright can run them in parallel safely, reducing overall runtime.
- **Config-driven capabilities:** Browser, viewport, retries, and reporter settings are centralized in `playwright.config.ts` for easy CI tuning.

## Why Playwright

- **Cross-browser support:** Single API for Chromium, Firefox, and WebKit.
- **Auto-waiting & stable selectors:** Reduces flakiness by waiting for elements and network state automatically.
- **Powerful test tooling:** Built-in test runner, fixtures, retries, trace recording, and trace viewer simplify debugging and CI integration.
- **Network control & emulation:** Easy request mocking, route interception, and device emulation for thorough scenarios.
- **Parallel test execution:** Designed to run tests concurrently while keeping tests isolated.

## Tech Stack

- **Node.js & npm**: Project runtime and package management.
- **TypeScript**: Language for tests and page objects.
- **Playwright & Playwright Test**: E2E automation and test runner.
- **Playwright Inspector / Trace Viewer**: For interactive debugging of failing tests and traces.
- **Configuration files:** `playwright.config.ts`, `tsconfig.json`, and `package.json` manage execution and compilation.

## Project Structure

- `playwright.config.ts` — Playwright runner configuration (browsers, retries, projects).
- `package.json` — scripts and dependencies.
- `tsconfig.json` — TypeScript compiler options.
- `src/pages/` — Page objects (e.g., store page abstractions).
- `tests/` — Test specs (e.g., `shoppingCart.spec.ts`).
- `playwright-report/` — Generated HTML reports and traces.

## Test Cases In This Project

Test Scenario 1: user selects and unselects multiple filters, should update product grid and product(s) found accordingly and accurately 

Test Scenario 2: user adds two distinct products to cart, should update cart and display two distinct items

Test Scenario 3: user increases quantity of a product in the cart, should increase quantity and update subtotal accurately

Test Scenario 4: user clears cart by pressing 'X' button on each button, should clear cart and validate the empty cart message is shown and the subtotal to be 0

## Extra Test Scenarios To Automate

Test Scenario 1: user adds products with multiple quantities, should be able to clear cart by clicking the subtract button until the quantity is 0 rather than the 'x' button

Test Scenario 2: user adds a product that was already in the cart by clicking 'add to cart', should increase quantity by one each time

Test Scenario 3: user decreases quantity of a product, should adjust subtotal accordingly and correctly

I would also add negative test cases (such as ensuring there is a upper quantity limit), mobile test cases (such as scrolling, responsiveness), accessibility test cases (keyboard navigation, screen reader capabilities)


