const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

module.exports = (req, res) => {
    // 1. استقبال اسم القناة من طلب Unity
    const channelName = req.query.channel;
    if (!channelName) {
        return res.status(400).json({ error: 'channel is required' });
    }

    // 2. قراءة المفاتيح من Environment Variables
    const appId = process.env.APP_ID;
    const appCertificate = process.env.APP_CERTIFICATE;

    if (!appId || !appCertificate) {
        return res.status(500).json({ error: 'APP_ID or APP_CERTIFICATE is not configured' });
    }

    // 3. تحديد UID كـ 0 ليعمل التوكن مع أي جهاز (اللاب أو الموبايل)
    const uid = 0;

    // 4. تحديد دور المستخدم كـ PUBLISHER (1) ليتكمن من فتح الكاميرا والمايك
    const role = RtcRole.PUBLISHER;

    // 5. تحديد مدة صلاحية التوكن (24 ساعة)
    const expirationTimeInSeconds = 86400; // 24 Hours
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // 6. بناء التوكن
    const token = RtcTokenBuilder.buildTokenWithUid(
        appId,
        appCertificate,
        channelName,
        uid,
        role,
        privilegeExpiredTs
    );

    // 7. إرجاع التوكن كـ JSON
    return res.json({ token });
};
