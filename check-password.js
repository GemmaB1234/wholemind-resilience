// Vercel Serverless Function
// Checks a Course Participants password server-side, so the real
// password never appears in the browser's JS bundle.
//
// There are now TWO separate participant areas — CMR and WholeMind —
// each with its own password, set via two separate environment
// variables.
//
// SETUP REQUIRED (one-time, in Vercel):
// 1. Vercel dashboard -> your project -> Settings -> Environment Variables
// 2. Add TWO variables:
//    CMR_PARTICIPANTS_PASSWORD       -> password for CMR course participants
//    WHOLEMIND_PARTICIPANTS_PASSWORD -> password for WholeMind course participants
// 3. Redeploy (Vercel does this automatically after saving an env variable,
//    or trigger one manually from the Deployments tab)
//
// To change a password later, just update its environment variable in
// Vercel and redeploy — no code change needed.

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { password, which } = req.body || {};

  const envVarName = which === 'cmr'
    ? 'CMR_PARTICIPANTS_PASSWORD'
    : which === 'wholemind'
    ? 'WHOLEMIND_PARTICIPANTS_PASSWORD'
    : null;

  if (!envVarName) {
    return res.status(400).json({ success: false, error: 'Unknown participant area' });
  }

  const correctPassword = process.env[envVarName];

  if (!correctPassword) {
    return res.status(500).json({ success: false, error: 'Password not configured yet' });
  }

  if (password === correctPassword) {
    return res.status(200).json({ success: true });
  }

  return res.status(200).json({ success: false });
}
