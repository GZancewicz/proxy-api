# Proxy API

A lightweight Express.js API that routes outbound GET requests through a rotating pool of proxies. Each request is forwarded through a randomly selected proxy, distributing traffic across the pool.

## Quick Start

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000`.

## Configuration

### Proxy List

Create a `proxies.txt` file in the project root with one proxy per line:

```
# Without authentication
123.45.67.89:8080

# With authentication
98.76.54.32:3128:myuser:mypass
```

Format: `host:port` or `host:port:username:password`

### Environment Variables

| Variable | Default | Description       |
|----------|---------|-------------------|
| `PORT`   | `3000`  | Server listen port |

## API Reference

### `GET /proxy?url=<target_url>`

Fetches the target URL through a randomly selected proxy and returns the response.

**Request:**

```bash
curl "http://localhost:3000/proxy?url=https://api.example.com/data"
```

**Success Response** (`200`):

```json
{
    "data": "<response from target URL>",
    "proxy": "123.45.67.89:8080"
}
```

**Error Responses:**

| Status | Cause                          |
|--------|--------------------------------|
| `400`  | Missing `url` query parameter  |
| `500`  | No proxies loaded or request failed |

```json
{
    "error": "Failed to proxy request",
    "details": "connect ETIMEDOUT"
}
```

### `GET /health`

Returns server status.

```json
{ "status": "ok" }
```

## Scripts

| Command         | Description                             |
|-----------------|-----------------------------------------|
| `npm start`     | Start the server                        |
| `npm run dev`   | Start with auto-reload via nodemon      |

## Tech Stack

- **Express** — HTTP server and routing
- **Axios** — Outbound HTTP client
- **https-proxy-agent** — Proxy tunneling for HTTP/HTTPS targets
- **cors** — Cross-origin request support

## License

[MIT](LICENSE)