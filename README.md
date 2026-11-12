# One Africa Shisha Billing

A lightweight, responsive point-of-sale and billing app for a shisha lounge. It runs in a modern browser without a server or build step.

## Run it

Open `index.html` in a browser, or serve this directory with any static web server. The app stores menu items and completed bills in that browser's local storage. Use the same browser and device to access saved records; this is not cloud-synced or multi-user software.

## Features

- Shisha session price fixed at **UGX 20,000 per session**; all shisha items use this standard price.
- Flavor-mix field on each shisha bill item for entering the customer's requested combination; free-text combinations are supported.
- Add non-shisha menu items with a custom UGX price.
- Each checkout requires the serving staff member's name and prints it on the receipt.
- Bill cart with quantity controls, optional customer name, discount, and configurable tax rate.
- Checkout by cash, card, or mobile money. Cash checkout calculates change and prevents underpayment.
- Printable itemized receipts (including requested flavor mix and serving staff name) and completed-bill history.
- Dashboard with today's sales, completed bill count, and average bill.
- Responsive layout for desktop and mobile screens.

## Notes

- Discount and tax settings should match your business and local tax requirements.
- Older receipts created before a serving-name was captured display “Not recorded.”
- Browser-local data can be lost when browser storage is cleared. Export/backup, user accounts, inventory, and cloud synchronization are not included.
- Use only for lawful sales and follow local age-verification, licensing, tax, and tobacco regulations.
