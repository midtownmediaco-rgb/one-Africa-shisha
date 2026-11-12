# One Africa Shisha Billing

A lightweight, responsive point-of-sale and billing app for a shisha lounge. It runs in a modern browser without a server or build step.

## Run it

Open `index.html` in a browser, or serve this directory with any static web server. The app stores menu items, completed bills, and currency preference in that browser's local storage. Use the same browser and device to access saved records; this is not cloud-synced or multi-user software.

## Features

- Shisha session price fixed at **UGX 20,000 per session**; all shisha items use this standard price.
- Flavor-mix field on each shisha bill item for entering the customer's requested combination; suggestions include mint, double apple, grape, blueberry, watermelon, lemon, strawberry, mango, peach, and vanilla. Free-text combinations are supported.
- Add non-shisha menu items with a custom UGX price.
- Bill cart with quantity controls, optional customer name, discount, and configurable tax rate.
- Checkout by cash, card, or mobile money. Cash checkout calculates change and prevents underpayment.
- Printable itemized receipts (including the requested flavor mix) and completed-bill history.
- Dashboard with today's sales, completed bill count, and average bill.
- Responsive layout for desktop and mobile screens.

## Notes

- Discount and tax settings should match your business and local tax requirements.
- Browser-local data can be lost when browser storage is cleared. Export/backup, user accounts, inventory, and cloud synchronization are not included.
- Use only for lawful sales and follow local age-verification, licensing, tax, and tobacco regulations.
