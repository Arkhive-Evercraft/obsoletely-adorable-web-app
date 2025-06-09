#!/bin/bash

# This script sets up a cron job to clean up expired cart reservations
# It should be run during deployment or server setup

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Define the cron job command - runs every 5 minutes
CRON_CMD="*/5 * * * * curl -s \"https://your-domain.com/api/cron/cleanup-reservations?apiKey=\${CRON_API_KEY}\" > /dev/null 2>&1"

# Add the cron job to the current user's crontab
(crontab -l 2>/dev/null || echo "") | grep -v "cleanup-reservations" | { cat; echo "$CRON_CMD"; } | crontab -

echo "✅ Cart reservation cleanup cron job has been scheduled"
echo "💡 Make sure to set the CRON_API_KEY environment variable for security"
