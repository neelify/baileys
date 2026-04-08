"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.writeBrandingLines = exports.getQrBranding = exports.getBaileysUpdateInfo = exports.getResolvedVersions = void 0;

const fs = require("fs");
const path = require("path");
const { checkNpmVersion } = require("./check-npm-version");

const BRAND = Object.freeze({
  name: "Neelegirly 💖",
  headerClaim: "Girly Glow-Up fuer WhatsApp Web",
  footerClaim: "QR Love · Stable Sessions · Update Glow",
  footerTagline: "Powered by Neelegirly for the cutest WhatsApp Web flow"
});

const ANSI = Object.freeze({
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  yellow: "\x1b[33m",
  gray: "\x1b[90m"
});

const color = (value, ansiColor) => `${ansiColor}${value}${ANSI.reset}`;

let packageMetaCache = null;
let updateCheckPromise = null;
let updateInfoCache = null;
let hasShownBaileysUpdateHint = false;
let hasShownWrapperUpdateHint = false;

const readJson = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
  } catch (_error) {
    return null;
  }
};

const readBaileysMeta = () => {
  if (packageMetaCache) {
    return packageMetaCache;
  }

  const filePath = path.join(__dirname, "..", "..", "package.json");
  const parsed = readJson(filePath) || {};

  packageMetaCache = {
    name: parsed.name || "@neelegirly/baileys",
    version: parsed.version || process.env.npm_package_version || "0.0.0"
  };

  return packageMetaCache;
};

const safeRequireVersion = (pkg) => {
  try {
    const resolved = require.resolve(`${pkg}/package.json`, { paths: [process.cwd(), __dirname] });
    const parsed = readJson(resolved);
    return parsed?.version ? String(parsed.version) : null;
  } catch (_error) {
    return null;
  }
};

const getResolvedVersions = () => {
  const meta = readBaileysMeta();
  const wrapperPackage = process.env.NEELEGIRLY_WRAPPER_PACKAGE || "";
  const wrapperVersion = process.env.NEELEGIRLY_WRAPPER_VERSION || "";
  const libsignalVersion = safeRequireVersion("@neelegirly/libsignal") || "";

  return {
    baileysPackage: meta.name,
    baileysVersion: meta.version,
    wrapperPackage: wrapperPackage || null,
    wrapperVersion: wrapperVersion || null,
    wrapperLatest: process.env.NEELEGIRLY_WRAPPER_UPDATE || null,
    libsignalVersion: libsignalVersion || null
  };
};

exports.getResolvedVersions = getResolvedVersions;

const getBaileysUpdateInfo = async () => {
  if (updateInfoCache) {
    return updateInfoCache;
  }

  if (!updateCheckPromise) {
    const { baileysPackage, baileysVersion } = getResolvedVersions();
    updateCheckPromise = checkNpmVersion(baileysPackage, baileysVersion, {
      githubRepo: "neelegirly/baileys",
      timeoutMs: 5000
    }).catch(() => null);
  }

  updateInfoCache = await updateCheckPromise;
  return updateInfoCache;
};

exports.getBaileysUpdateInfo = getBaileysUpdateInfo;

const buildDivider = () => color("============================================================", ANSI.gray);

const getQrBranding = async () => {
  const versions = getResolvedVersions();
  const update = await getBaileysUpdateInfo();
  const shouldShowBaileysUpdateHint = Boolean(update?.hasUpdate) && !hasShownBaileysUpdateHint;
  const shouldShowWrapperUpdateHint =
    Boolean(versions.wrapperPackage && versions.wrapperLatest) && !hasShownWrapperUpdateHint;

  const headerLines = [
    buildDivider(),
    color(`${ANSI.bold}${BRAND.name}${ANSI.reset} | ${BRAND.headerClaim}`, ANSI.magenta),
    color(`Neelegirly Glow Version: ${versions.baileysVersion}`, ANSI.cyan),
    color(`Paket: ${versions.baileysPackage} v${versions.baileysVersion}`, ANSI.cyan)
  ];

  if (versions.wrapperPackage && versions.wrapperVersion) {
    headerLines.push(
      color(`Wrapper: ${versions.wrapperPackage} v${versions.wrapperVersion}`, ANSI.cyan)
    );
  }

  if (versions.libsignalVersion) {
    headerLines.push(color(`Signal-Core: @neelegirly/libsignal v${versions.libsignalVersion}`, ANSI.cyan));
  }

  if (shouldShowBaileysUpdateHint) {
    const source = update.source || "npm";
    headerLines.push(
      color(
        `Update verfuegbar (${versions.baileysPackage}): ${update.latest} | Quelle: ${source}`,
        ANSI.yellow
      )
    );
  }

  if (shouldShowWrapperUpdateHint) {
    headerLines.push(
      color(
        `Update verfuegbar (${versions.wrapperPackage}): ${versions.wrapperLatest}`,
        ANSI.yellow
      )
    );
  }

  const footerLines = [
    color(`💖 ${BRAND.footerClaim}`, ANSI.magenta),
    color(`Powered by ${BRAND.name}`, ANSI.cyan),
    color(BRAND.footerTagline, ANSI.cyan),
    color(`Aktive Basis: ${versions.baileysPackage} v${versions.baileysVersion}`, ANSI.gray)
  ];

  if (shouldShowBaileysUpdateHint) {
    footerLines.push(
      color(`Du nutzt ${update.current}, neu ist ${update.latest}.`, ANSI.yellow)
    );
  }

  if (shouldShowWrapperUpdateHint) {
    footerLines.push(
      color(
        `Du nutzt ${versions.wrapperVersion} (${versions.wrapperPackage}), neu ist ${versions.wrapperLatest}.`,
        ANSI.yellow
      )
    );
  }

  if (shouldShowBaileysUpdateHint) {
    hasShownBaileysUpdateHint = true;
  }
  if (shouldShowWrapperUpdateHint) {
    hasShownWrapperUpdateHint = true;
  }

  footerLines.push(buildDivider());

  return {
    headerLines,
    footerLines,
    versions,
    update
  };
};

exports.getQrBranding = getQrBranding;

const writeBrandingLines = (lines, logger) => {
  if (!Array.isArray(lines) || !lines.length) {
    return;
  }

  for (const line of lines) {
    if (!line) continue;

    if (logger && typeof logger.info === "function" && logger.level && logger.level !== "silent") {
      logger.info(line);
      continue;
    }

    console.log(line);
  }
};

exports.writeBrandingLines = writeBrandingLines;
