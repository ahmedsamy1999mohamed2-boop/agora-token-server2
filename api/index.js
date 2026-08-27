const { RtcTokenBuilder, RtcRole } = require('agora-token');

module.exports = (req, res) => {
    // السماح بالاتصال من أي مكان (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const appId = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    if (path.includes('/token')) {
        const channelName = url.searchParams.get('channel');
        
        if (!channelName) {
            return res.status(400).json({ error: 'Channel name is required!' });
        }

        if (!appId || !appCertificate) {
            return res.status(500).json({ error: 'App ID or Certificate missing in environment variables!' });
        }

        const uid = 0;
        const role = RtcRole.PUBLISHER;
        const privilegeExpireTime = 3600; // مدة الصلاحية بالثواني (ساعة)

        // توليد التوكن الحديث المتوافق مع Agora SDK v4.x
        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpireTime,
            privilegeExpireTime
        );

        return res.status(200).json({ token: token });
    }

    return res.status(200).json({ status: "Agora Token Server is online 24/7 on Vercel! 🚀" });
};
