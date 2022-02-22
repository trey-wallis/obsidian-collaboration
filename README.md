# Obsidian Collaboration

## About

Obsidian Collaboration allows teams to collaborate directly in Obsidian on a vault saved on Google Drive. For each member that is collaborating, vault files are downloaded from Google Drive and stored in memory rather directly on the file system of a user. This allows files to be restricted to the workspace of a specific company.
## Built With

- [Obsidian.md Plugin Template](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Socket.IO](https://socket.io/)

## Development

### Installation

Create secret keys for the following items:

- SSH_HOST - the address of where the server will be hosted
- SSH_USER - the user github will use to login
- SSH_KEY - the private key of your user
- SSH_PORT - 22

### Plugin

Install packages

- `npm install`

Run development script

- `npm run dev`

Go to community plugins in Obsidian and disable safe mode.

Create a plugins folder if one doesn't already exist

- mkdir `my-vault/.obsidian/plugins`

Place the plugin into your folder or create a symbolic link

### Server

Turn on the server

- `docker-compose up -d --build`

Turn off the server

- `docker-compose down`

### Improve code quality with eslint (optional)

- [ESLint](https://eslint.org/) is a tool that analyzes your code to quickly find problems. You can run ESLint against your plugin to find common bugs and ways to improve your code.
- To use eslint with this project, make sure to install eslint from terminal:
  - `npm install -g eslint`
- To use eslint to analyze this project use this command:
  - `eslint main.ts`
  - eslint will then create a report with suggestions for code improvement by file and line number.
- If your source code is in a folder, such as `src`, you can use eslint with this command to analyze all files in that folder:
  - `eslint .\src\`

## Deployment

### Plugin

Create build script

- `npm run build`

## Resources

- [Obsidian API Documentation](https://github.com/obsidianmd/obsidian-api)

## License

- MIT

## Author

- Trey Wallis
