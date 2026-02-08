#!/bin/bash

# Configuration
API_URL="http://localhost:3000/api/v1"
TEST_URL="https://example.com/?t=$(date +%s)"

echo "🔍 Testing Web Intelligence Layer Flow..."

# 1. Check Health
echo "1️⃣  Checking System Health..."
HEALTH_STATUS=$(curl -s "$API_URL/health")
echo "   Status: $HEALTH_STATUS"

# 2. Submit URL
echo -e "\n2️⃣  Submitting URL: $TEST_URL"
SUBMIT_RESPONSE=$(curl -s -X POST "$API_URL/urls" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"$TEST_URL\", \"priority\": 10, \"sourceType\": \"html\"}")

echo "   Response: $SUBMIT_RESPONSE"
JOB_ID=$(echo $SUBMIT_RESPONSE | grep -o '"jobId":"[^"]*' | cut -d'"' -f4)

if [ -z "$JOB_ID" ]; then
  echo "❌ Failed to submit URL"
  exit 1
fi

echo "   ✅ Job ID: $JOB_ID"

# 3. Poll for Dossier
echo -e "\n3️⃣  Polling for Dossier Generation (Waiting up to 30s)..."
# Give it some time to process
for i in {1..15}; do
  echo -n "."
  sleep 2
done
echo ""

# We check for the latest dossier, assuming it's ours or related
echo "   Fetching latest dossiers..."
DOSSIERS_RESPONSE=$(curl -s "$API_URL/dossiers?limit=1")
# extract the first dossier ID if available
DOSSIER_ID=$(echo $DOSSIERS_RESPONSE | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$DOSSIER_ID" ]; then
  echo "⚠️  No dossier found yet. The worker might still be processing or the queue is not running."
  echo "   Check the 'npm run dev' console for worker logs."
else
  echo "   ✅ Dossier Found: $DOSSIER_ID"
  
  # 4. Get Full Dossier
  echo -e "\n4️⃣  Retrieving Full Dossier..."
  curl -s "$API_URL/dossiers/$DOSSIER_ID/markdown" > dossier_output.md
  
  echo "   📄 Dossier saved to 'dossier_output.md'"
  echo "   Preview of Content:"
  echo "   -----------------------------------"
  head -n 20 dossier_output.md
  echo "   -----------------------------------"
fi

echo -e "\n✅ Test Complete!"
