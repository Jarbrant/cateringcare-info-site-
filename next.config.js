/**
 * Next.js configuration
 * Security headers included
 */

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin"
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block"
  }
];

module.exports = {

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};
