export interface VersionInfo {
    current: string;
    latest: string;
    hasUpdate: boolean;
    changelog?: string;
}
/**
 * Check if a new version is available on NPM
 * @param packageName - The package name to check (e.g., '@neelify/baileys')
 * @param currentVersion - The current version installed
 * @returns Promise with version info or null if check fails
 */
export declare const checkNpmVersion: (packageName: string, currentVersion: string) => Promise<VersionInfo | null>;
//# sourceMappingURL=check-npm-version.d.ts.map




