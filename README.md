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

```bash
docker compose --profile frontend up
```

Navigate to `localhost:8080/login`

### Run load tests

Ensure JMeter has enough heap memory, e.g:

```bash
export JVM_ARGS="-Xms1g -Xmx4g -XX:MaxMetaspaceSize=256m"
```

#### 1 user

```bash
jmeter -n -t ./scripts/test-run-1/sample_test_script.jmx -l results.log -e -o ./results
```

#### 1k to 20k users

```bash
jmeter -n -t ./scripts/test-run-3/InitialSetup.jmx -l results.log -e -o ./results
jmeter -n -t ./scripts/test-run-3/UserThreadTest.jmx -l results.log -e -o ./results
```
