# Obsidian Live Share

## About
Obsidian Live Share allows you to have a Google Docs like experience with your friends. Live collaborate on files and have changes propagate to other user's vault files.

Note: Obsidian Live Share is not a cloud system or competitor to Obsidian Sync. Obsidian Live Share is meant to allow real time collaboration while also files are backed up by the user.
## Built With
- [Lerna](https://lerna.js.org/)
- [Obsidian.md Plugin Template](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Socket.IO](https://socket.io/)
## Installation

Install packages
- `npm install`

Boostrap packages with Lerna
- `lerna bootstrap`

Clone the plugin repository
Place the directory into your `./obsidan/plugins` folder
Activate the plugin
## Development
- Make plugins folder in your obsidian vault if it doesn't exists
- `mkdir plugins vault/.obsidian`
Make a symbolic link from the plugin folder to your obsidian vault plugins folder
- `ln -s obsidian-live-share/packages/obsidian-live-share vault/.obsidian/plugins`

### Improve code quality with eslint (optional)
- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code. 
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`
## Resources
- [Obsidian API Documentation](https://github.com/obsidianmd/obsidian-api)

## License
- MIT
## Author
- Trey Wallis