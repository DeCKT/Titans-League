class DynamicTwitchButton {
    constructor() {
        this.clientId = '59dc1al7tmsihda68w5gzobcnpjyh6' // 
        this.clientSecret = 'kspl1lgp76whk8e4caovmbv13j96d7'
          this.accessToken = null;
        this.tokenExpiry = null;
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
        
        this.init();
    }

    async init() {
        // Get initial access token
        await this.getAccessToken();
        
        // Find all dynamic buttons and update them
        const buttons = document.querySelectorAll('.dynamic-button');
        buttons.forEach(button => {
            // Ensure button has relative positioning for the indicator
            button.style.position = 'relative';
            this.updateButton(button);
        });
        
        // Set up periodic updates every 2 minutes
        setInterval(() => {
            buttons.forEach(button => this.updateButton(button));
        }, 120000);
    }

    createLiveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'live-indicator absolute top-0 right-0 translate-x-1/5 -translate-y-1/3 text-xs bg-red-800 flex flex-col justify-center px-1 py-0.5 rounded-md text-white';
        indicator.textContent = 'LIVE';
        return indicator;
    }

    addLiveIndicator(button) {
        // Remove existing indicator if present
        this.removeLiveIndicator(button);
        
        // Add new indicator
        const indicator = this.createLiveIndicator();
        button.appendChild(indicator);
    }

    removeLiveIndicator(button) {
        const existingIndicator = button.querySelector('.live-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
    }

    async getAccessToken() {
        // Check if current token is still valid
        if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await fetch('https://id.twitch.tv/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'client_id': this.clientId,
                    'client_secret': this.clientSecret,
                    'grant_type': 'client_credentials'
                })
            });

            if (!response.ok) {
                throw new Error(`Token fetch failed: ${response.status}`);
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            // Set token expiry with a 5-minute buffer
            this.tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000);
            
            return this.accessToken;
        } catch (error) {
            console.error('Error fetching access token:', error);
            throw error;
        }
    }

    async updateButton(button) {
        const channelName = button.dataset.twitchChannel;
        const twitchUrl = button.dataset.twitchUrl;
        const youtubeUrl = button.dataset.youtubeUrl;
        const keywords = button.dataset.keywords ? button.dataset.keywords.split(',') : [];
        const liveText = button.dataset.liveText || 'Watch Live!';
        const defaultText = button.dataset.defaultText || 'Watch Now!';

        try {
            const streamData = await this.getStreamData(channelName);
            
            if (streamData && this.containsKeywords(streamData.title, keywords)) {
                // Channel is live with matching keywords
                button.href = twitchUrl;
                button.textContent = liveText;
                this.addLiveIndicator(button);
            } else {
                // Channel is offline or doesn't match keywords
                button.href = youtubeUrl;
                button.textContent = defaultText;
                this.removeLiveIndicator(button);
            }
        } catch (error) {
            console.error('Error checking Twitch status:', error);
            // Fallback to YouTube link
            button.href = youtubeUrl;
            button.textContent = defaultText;
            this.removeLiveIndicator(button);
        }
    }

    async getStreamData(channelName) {
        // Check cache first
        const cacheKey = `stream_${channelName}`;
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        try {
            // Ensure we have a valid token
            const token = await this.getAccessToken();
            
            const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
                headers: {
                    'Client-ID': this.clientId,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If we get a 401, try refreshing the token and retry once
                if (response.status === 401) {
                    this.accessToken = null;
                    this.tokenExpiry = null;
                    const newToken = await this.getAccessToken();
                    
                    const retryResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${channelName}`, {
                        headers: {
                            'Client-ID': this.clientId,
                            'Authorization': `Bearer ${newToken}`
                        }
                    });
                    
                    if (!retryResponse.ok) {
                        throw new Error(`HTTP error! status: ${retryResponse.status}`);
                    }
                    
                    const data = await retryResponse.json();
                    const streamData = data.data.length > 0 ? data.data[0] : null;
                    
                    // Cache the result
                    this.cache.set(cacheKey, {
                        data: streamData,
                        timestamp: Date.now()
                    });
                    
                    return streamData;
                }
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const streamData = data.data.length > 0 ? data.data[0] : null;
            
            // Cache the result
            this.cache.set(cacheKey, {
                data: streamData,
                timestamp: Date.now()
            });

            return streamData;
        } catch (error) {
            console.error('Error fetching stream data:', error);
            return null;
        }
    }

    containsKeywords(title, keywords) {
        if (!title || keywords.length === 0) return true;
        
        const lowerTitle = title.toLowerCase();
        return keywords.some(keyword => 
            lowerTitle.includes(keyword.trim().toLowerCase())
        );
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DynamicTwitchButton();
});