# One Africa Shisha Billing

A lightweight, responsive point-of-sale and billing app for a shisha lounge. It runs in a modern browser without a server or build step.

## Run it

Open `index.html` in a browser, or serve this directory with any static web server. The app stores menu items, completed bills, and currency preference in that browser's local storage. Use the same browser and device to access saved records; this is not cloud-synced or multi-user software.

## Features

- Product menu grouped by category, quick search, and add-item form.
- Bill cart with quantity controls, optional customer name, discount, and configurable tax rate.
- Checkout by cash, card, or mobile money. Cash checkout calculates change and prevents underpayment.
- Printable itemized receipts and completed-bill history with filters.
- Dashboard with today's sales, completed bill count, and average bill.
- Currency display choices for USD, ZMW, KES, UGX, TZS, GHS, NGN, and ZAR.
- Responsive layout for desktop and mobile screens.

## Notes

- The sample menu and prices are examples. Update them using **Add item** and select the appropriate currency for your business before billing.
- Tax defaults to 0%; set the correct rate for your location. Discounts are entered as a fixed amount in the selected currency.
- Browser-local data can be lost when browser storage is cleared. Export/backup, user accounts, inventory, and cloud synchronization are not included.
- Use only for lawful sales and follow local age-verification, licensing, tax, and tobacco regulations.
