"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNpmVersion = void 0;

const https = require("https");

const DEFAULT_TIMEOUT_MS = 5000;

const normalizeVersion = (value) =>
  String(value || "")
    .trim()
    .replace(/^v/i, "")
    .split("-")[0];

const compareSemver = (a, b) => {
  const aParts = normalizeVersion(a)
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);
  const bParts = normalizeVersion(b)
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);

  const max = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < max; i += 1) {
    const left = aParts[i] || 0;
    const right = bParts[i] || 0;
    if (left > right) return 1;
    if (left < right) return -1;
  }
  return 0;
};

const isNewerVersion = (latest, current) => compareSemver(latest, current) > 0;

const requestJson = (url, options = {}) =>
  new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        timeout: Number(options.timeoutMs) > 0 ? Number(options.timeoutMs) : DEFAULT_TIMEOUT_MS,
        headers: {
          "User-Agent": options.userAgent || "@neelegirly/version-check",
          Accept: "application/json",
          ...(options.headers || {})
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`Request failed with status ${res.statusCode}`));
            return;
          }
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("version-check-timeout"));
    });
  });

const checkNpmVersion = async (packageName, currentVersion, options = {}) => {
  if (!packageName || !currentVersion) {
    return null;
  }

  const current = normalizeVersion(currentVersion);
  let latest = null;
  let source = null;

  try {
    const npmInfo = await requestJson(`https://registry.npmjs.org/${packageName}/latest`, {
      timeoutMs: options.timeoutMs,
      userAgent: `${packageName} update-check`
    });
    const npmVersion = normalizeVersion(npmInfo?.version);
    if (npmVersion) {
      latest = npmVersion;
      source = "npm";
    }
  } catch (_error) {
    // ignore npm errors and continue with GitHub fallback
  }

  if (!latest && options.githubRepo) {
    try {
      const ghInfo = await requestJson(
        `https://api.github.com/repos/${options.githubRepo}/releases/latest`,
        {
          timeoutMs: Number(options.timeoutMs || DEFAULT_TIMEOUT_MS) + 1000,
          userAgent: `${packageName} update-check`,
          headers: {
            Accept: "application/vnd.github+json"
          }
        }
      );
      const ghVersion = normalizeVersion(ghInfo?.tag_name);
      if (ghVersion) {
        latest = ghVersion;
        source = "github";
      }
    } catch (_error) {
      // ignore fallback errors
    }
  }

  if (!latest) {
    return null;
  }

  return {
    current,
    latest,
    hasUpdate: isNewerVersion(latest, current),
    source
  };
};

exports.checkNpmVersion = checkNpmVersion;
