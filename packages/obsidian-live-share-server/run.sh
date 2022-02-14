# Kill the current running instance
kill -9 `pidof node`

# Start a new instance
node index.js &>/dev/null &