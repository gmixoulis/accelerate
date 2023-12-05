#!/bin/bash

### Usage example: 
## ./release-port.sh <port>
## ./release-port.sh 3000

# Get the port number as input
port=$1

# Find the process id using lsof
pid=$(lsof -t -i:$port)

# Kill the process
kill -9 $pid

# Confirm it worked
new_pid=$(lsof -t -i:$port)

if [ -z "$new_pid" ]
then
  echo "Successfully killed process on port $port"
else
  echo "Failed to kill process on port $port"
fi
