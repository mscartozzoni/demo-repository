// Mock API for Firewall and CDN settings

const getMockSettings = () => {
    return {
        sql_injection_protection: true,
        xss_protection: true,
        bot_mitigation: false,
        cdn_enabled: true,
        cache_level: 'aggressive', // 'basic', 'aggressive', 'everything'
    };
};

export const getFirewallSettings = async () => {
    console.log('[Mock API] Fetching firewall settings...');
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    return {
        success: true,
        data: getMockSettings(),
    };
};

export const updateFirewallSettings = async (settings) => {
    console.log('[Mock API] Updating firewall settings:', settings);
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay
    
    // In a real app, you would save this to your backend.
    // For this mock, we'll just log it.
    
    if (Math.random() < 0.1) { // 10% chance of failure for simulation
        return { success: false, message: 'Falha de rede simulada.' };
    }

    return {
        success: true,
        data: settings,
    };
};