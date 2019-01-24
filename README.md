# Sync Safari Reading List to Kindle

Ever wanted to add an article to your Safari Reading List and have it sent to your Kindle? This script can help.

## Usage

1. Clone the repo locally
2. Copy `.env-example` to `.env` and fill in your credentials/configuration data
3. Set up the script to run automatically when `~/Library/Safari/Bookmarks.plist` is updated (via Hazel, fswatch, etc.)

## Caveats

+ You will probably need to whitelist your node binary and watch tool for Full Disk Access
+ The script makes no effort to prevent duplicate sends (this will be improved in the future)

## License & Conduct

This project is licensed under the terms of the MIT License, included in `LICENSE.md`.

This project follows a strict code of conduct, included in `CODEOFCONDUCT.md`. We ask that all contributors adhere to the standards and guidelines in that document.

Thank you!
