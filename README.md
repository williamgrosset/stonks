# 🤑 stonks

A highly scalable and performant day trading system.

## Development

### Run services

```bash
docker compose up
```

### Send requests

```bash
curl -X POST http://localhost:5001/authentication/register \
    -H "Content-Type: application/json" \
    -d '{ "user_name": "janedoe", "password": "password123" }'
```

### Use web UI

Navigate to `localhost:8080/login`

### Run load tests

#### 1 user

```bash
jmeter -n -t ./scripts/test-run-1/sample_test_script.jmx -l results.log
```

#### 1k to 10k users

```bash
jmeter -n -t ./scripts/test-run-2/InitialSetup.jmx -l results.log
jmeter -n -t ./scripts/test-run-2/UserThreadTest.jmx -l results.log
```
