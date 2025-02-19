# stonks

a highly scalable & performant day trading system

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

Navigate to `localhost:8080/login`.
