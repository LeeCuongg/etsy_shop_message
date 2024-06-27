# Etsy Shop Crawler Chrome Extension

## Overview

The Etsy Shop Crawler Chrome Extension is designed to automate the process of crawling Etsy shop pages to extract details such as shop name, avatar, country, listing count, and review count. The extension stores the collected data locally and periodically exports it to a CSV file and posts it to an API endpoint.

## Features

- **Automated Crawling**: Automatically navigates through Etsy shop search result pages.
- **Data Extraction**: Extracts shop name, avatar, country, listing count, and review count from each shop listing.
- **Data Storage**: Stores extracted shop data locally using Chrome's storage API.
- **CSV Export**: Exports the collected shop data to a CSV file named with the current timestamp.
- **API Integration**: Posts the collected shop data to a specified API endpoint.
- **Periodic Crawling**: Waits for 6 hours after reaching the end of the pages and then restarts the crawling process.
- **Countdown Timer**: Displays the remaining time to the next run every 5 minutes.