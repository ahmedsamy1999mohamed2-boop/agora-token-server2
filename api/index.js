const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');

const app = express();
app.use(express.json());

// مسار فحص حالة السيرفر للتأكد إنه شغال
app.get('/api', (req, res) => {
    res.json({ status: "Agora Token Server is online 24/7 on Vercel! 🚀" });
});

// مسار توليد التوكن
app.get('/api/token', (req, res) => {
  const APP_ID = "0ce08c94ee6644fd8e406f2f794df809"; const APP_CERTIFICATE = "2d3c4224d9dc43a6886eaa26619a063d"; 
    
    const channelName = req.query.channel;
    if (!channelName) {
        return res.status(400).json({ error: 'channel name is required' });
    }

    const uid = 0;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // استخدام مكتبة agora-token لتوليد التوكن
    const token = RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channelName,
        uid,
        role,
        expirationTimeInSeconds,
        privilegeExpiredTs
    );

    return res.json({ token });
});

// تصدير التطبيق ليعمل بنجاح على Vercel Serverless
module.exports = app;