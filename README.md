# Proxy API

A simple API that routes GET requests through randomly selected proxies from a list.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure your `proxies.txt` file is in the root directory and contains your proxy list in the format:
```
ip1:port1
ip2:port2
ip3:port3
```

## Running the API

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The API will run on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Proxy Request
```
GET /proxy?url=<target_url>
```

Example:
```bash
curl "http://localhost:3000/proxy?url=https://api.example.com/data"
```

Response:
```json
{
    "data": "<response data from target URL>",
    "proxy": "ip:port"
}
```

### Health Check
```
GET /health
```

Response:
```json
{
    "status": "ok"
}
```

## Error Handling

The API will return appropriate error messages if:
- The URL parameter is missing
- No proxies are available
- The proxy request fails