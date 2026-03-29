"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNpmVersion = void 0;
const https_1 = require("https");

function isNewerVersion(latest, current) {
    if (!latest || !current) return false;
    const a = current.split('.').map((n) => parseInt(n, 10) || 0);
    const b = latest.split('.').map((n) => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
        const x = a[i] || 0, y = b[i] || 0;
        if (y > x) return true;
        if (y < x) return false;
    }
    return false;
}

/**
 * Liest von der offiziellen npm-Registry (registry.npmjs.org), ob eine neuere Version existiert.
 * @param packageName - Paketname (z.B. '@neelify/baileys')
 * @param currentVersion - Aktuell installierte Version
 * @returns Promise mit Version-Info oder null bei Fehler
 */
const checkNpmVersion = (packageName, currentVersion) => {
    return new Promise((resolve) => {
        // Offizielle npm-Registry: https://registry.npmjs.org/
        const url = `https://registry.npmjs.org/${packageName}/latest`;
        https_1.default.get(url, { timeout: 5000 }, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const packageInfo = JSON.parse(data);
                    const latestVersion = packageInfo.version;
                    if (latestVersion && isNewerVersion(latestVersion, currentVersion)) {
                        resolve({
                            current: currentVersion,
                            latest: latestVersion,
                            hasUpdate: true,
                            changelog: packageInfo.description || 'Neue Version verfügbar!'
                        });
                    }
                    else {
                        resolve({
                            current: currentVersion,
                            latest: latestVersion,
                            hasUpdate: false
                        });
                    }
                }
                catch (error) {
                    resolve(null);
                }
            });
        }).on('error', () => {
            resolve(null);
        }).on('timeout', () => {
            resolve(null);
        });
    });
};
exports.checkNpmVersion = checkNpmVersion;
//# sourceMappingURL=check-npm-version.js.map



