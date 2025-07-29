/**
 * Runtime configuration for the TOYBOX application
 * This centralizes all configuration constants that were previously scattered
 */

interface GitHubConfig {
  username: string;
  repository: string;
  baseUrl: string;
  homepage: string;
  repoUrl: string;
  isConfigured: boolean;
}

/**
 * Get the base URL for the current environment
 * In development: always '/'
 * In production: from Vite's base configuration
 */
export function getBaseUrl(): string {
  return import.meta.env.BASE_URL || '/';
}

/**
 * Get GitHub configuration from build-time injection
 * These values are populated during the build process
 */
export function getGitHubConfig(): GitHubConfig {
  // These will be replaced at build time by vite
  const username = import.meta.env.VITE_GITHUB_USERNAME || 'YOUR_GITHUB_USERNAME';
  const repository = import.meta.env.VITE_GITHUB_REPOSITORY || 'YOUR_REPO_NAME';
  const isConfigured = !username.includes('YOUR_') && !repository.includes('YOUR_');
  
  return {
    username,
    repository,
    baseUrl: getBaseUrl(),
    homepage: isConfigured ? `https://${username}.github.io/${repository}` : '',
    repoUrl: isConfigured ? `https://github.com/${username}/${repository}` : '',
    isConfigured
  };
}

/**
 * Check if we're running in production mode
 */
export function isProduction(): boolean {
  return import.meta.env.PROD;
}

/**
 * Get the full URL for a given path
 */
export function getUrl(path: string): string {
  const baseUrl = getBaseUrl();
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return baseUrl.endsWith('/') ? baseUrl + cleanPath : baseUrl + '/' + cleanPath;
}