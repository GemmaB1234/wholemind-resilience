// Vercel Serverless Function
// Checks the Course Participants password server-side, so the real
// password never appears in the browser's JS bundle.
//
// SETUP REQUIRED (one-time, in Vercel):
// 1. Vercel dashboard -> your project -> Settings -> Environment Variables
// 2. Add a variable named: PARTICIPANTS_PASSWORD
//    Value: whatever password you want participants to use
// 3. Redeploy (Vercel does this automatically after saving an env variable,
//    or trigger one manually from the Deployments tab)
//
// To change the password later, just update the environment variable
// in Vercel and redeploy — no code change needed.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const correctPassword = process.env.PARTICIPANTS_PASSWORD;

  if (!correctPassword) {
    // Env variable not set yet in Vercel
    return res.status(500).json({ success: false, error: 'Password not configured yet' });
  }

  if (password === correctPassword) {
    return res.status(200).json({ success: true });
  }

  return res.status(200).json({ success: false });
}
