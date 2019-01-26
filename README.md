# Sync Safari Reading List to Kindle

Ever wanted to add an article to your Safari Reading List and have it sent to your Kindle? This script can help!

It leverages the [SendToReader](https://sendtoreader.com) API to format and send articles to your Kindle. Make sure you have an account and have configured it correctly.

## Usage

1. Clone the repo locally
2. Copy `.env-example` to `.env` and fill in your credentials/configuration data
3. Set up the script to run automatically when `~/Library/Safari/Bookmarks.plist` is modified (a watch tool, like Hazel or fswatch, will help), or via a cron job

## Caveats

+ In recent macOS versions, `~/Library/Safari/Bookmarks.plist` is protected by the system. Make sure you whitelist your task runner for Full Disk Access
+ Safari is fairly liberal in how often it modifies the `Bookmarks.plist`, which can lead to duplicate events. To prevent this, the script uses a local JSON file as a database, and only sends URLs that haven't previously been marked sent
+ There is some rudimentary logging to make it easier to diagnose issues. You may want to capture your `stdout` and/or `stderr` to a log file if you're running this utility outside of a terminal

## License & Conduct

This project is licensed under the terms of the MIT License, included in `LICENSE.md`.

This project follows a strict code of conduct, included in `CODEOFCONDUCT.md`. We ask that all contributors adhere to the standards and guidelines in that document.

Thank you!
