const { proxyApiRequest } = require('./_shared/backend-proxy');

module.exports = async function handler(req, res) {
  await proxyApiRequest(req, res);
};
