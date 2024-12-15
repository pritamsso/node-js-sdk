const axios = require('axios');
const axiosRetry = require('axios-retry');

class JwtRevokeClient {
    constructor(apiKey, options = {}) {
        const {
            maxRetries = 3,
            timeout = 10000,
            baseURL = 'https://api.jwtrevoke.com',
            rateLimitRetryDelay = 1000,
        } = options;

        this.client = axios.create({
            baseURL,
            timeout,
            headers: {
                'X-API-Key': apiKey,
                'Content-Type': 'application/json',
            },
        });

        // Configure automatic retries
        axiosRetry(this.client, {
            retries: maxRetries,
            retryDelay: (retryCount, error) => {
                if (error.response?.status === 429) {
                    return rateLimitRetryDelay;
                }
                return axiosRetry.exponentialDelay(retryCount);
            },
            retryCondition: (error) => {
                return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
                    error.response?.status === 429;
            },
        });

        // Add response interceptor for error handling
        this.client.interceptors.response.use(
            response => response,
            error => {
                if (error.response) {
                    throw new JwtRevokeError(
                        error.response.data.message || 'API request failed',
                        error.response.status,
                        error.response.data
                    );
                }
                throw error;
            }
        );
    }

    async listRevokedTokens() {
        const response = await this.client.get('/api/revocations/list');
        return response.data;
    }

    async revokeToken(jwtId, reason, expiryDate) {
        const response = await this.client.post('/api/revocations/revoke', {
            jwtId,
            reason,
            expiryDate,
        });
        return response.data;
    }

    async deleteRevokedToken(jwtId) {
        await this.client.delete(`/api/revocations/${jwtId}`);
    }
}

class JwtRevokeError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'JwtRevokeError';
        this.status = status;
        this.data = data;
    }
}

module.exports = { JwtRevokeClient, JwtRevokeError }; 