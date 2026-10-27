#!/bin/bash
# Run dev server + E2E suite in one session (sandbox kills bg processes between calls)
cd /home/z/my-project

# start dev server
bun run dev > /dev/null 2>&1 &
SERVER_PID=$!

# wait for ready
for i in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 http://localhost:3000 2>/dev/null)
  [ "$code" = "200" ] && break
  sleep 3
done
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 20 http://localhost:3000 2>/dev/null)
echo "server status: $code (pid $SERVER_PID)"
if [ "$code" != "200" ]; then
  echo "SERVER FAILED TO START"; kill $SERVER_PID 2>/dev/null; exit 1
fi

# extra warmup compile
sleep 5

# run the suite
/home/z/.venv/bin/python scripts/e2e_portfolio_test.py
RESULT=$?

# cleanup
kill $SERVER_PID 2>/dev/null
pkill -f "next dev" 2>/dev/null
exit $RESULT
