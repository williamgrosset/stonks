<html>
  <head>
    <link href="https://unpkg.com/@vercel/geist-font" rel="stylesheet">
    <style>
      .title {
        font-family: 'Geist', sans-serif;
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        display: block;
      }
    </style>
  </head>
  <body>
    <p class="title">🤑 stonks</p>
  </body>
</html>

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
