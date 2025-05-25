const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const { HttpsProxyAgent } = require('https-proxy-agent');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Function to read and parse proxies from file
async function getProxies() {
    try {
        const data = await fs.readFile('proxies.txt', 'utf8');
        return data.split('\n').filter(proxy => proxy.trim() !== '');
    } catch (error) {
        console.error('Error reading proxies:', error);
        return [];
    }
}

// Function to get a random proxy
function getRandomProxy(proxies) {
    const randomIndex = Math.floor(Math.random() * proxies.length);
    return proxies[randomIndex];
}

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const proxies = await getProxies();

        if (proxies.length === 0) {
            return res.status(500).json({ error: 'No proxies available' });
        }

        const proxy = getRandomProxy(proxies);
        // Parse proxy string
        const [host, port, username, password] = proxy.split(':');
        let proxyUrl;
        if (username && password) {
            proxyUrl = `http://${username}:${password}@${host}:${port}`;
        } else {
            proxyUrl = `http://${host}:${port}`;
        }
        console.log('Using proxy:', proxyUrl);

        let axiosConfig = {};
        if (targetUrl.startsWith('https://')) {
            axiosConfig = {
                httpsAgent: new HttpsProxyAgent(proxyUrl),
            };
        } else {
            axiosConfig = {
                httpAgent: new HttpsProxyAgent(proxyUrl),
            };
        }

        const response = await axios.get(targetUrl, axiosConfig);
        res.json({
            data: response.data,
            proxy: proxy
        });
    } catch (error) {
        console.error('Proxy request error:', error.message);
        res.status(500).json({
            error: 'Failed to proxy request',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Proxy API server running on port ${PORT}`);
}); 