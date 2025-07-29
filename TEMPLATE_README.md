# TOYBOX Template

A React-based portfolio/gallery application for showcasing Claude-generated artifacts. This template is designed to be deployed to GitHub Pages and serves as a starting point for creating personal artifact collections.

## 🚀 Using This Template

## 🤖 MCP Integration (Recommended)

This template is designed to work seamlessly with the TOYBOX MCP server:

1. Install the TOYBOX MCP server in Claude Desktop
2. Use the command: "Initialize a new TOYBOX repository called 'my-portfolio'"
3. The MCP server will automatically:
   - Clone this template
   - Configure all GitHub settings
   - Set up deployment workflows
   - Enable GitHub Pages

## 🔧 Manual Setup (Alternative)

If not using MCP integration:

### 1. Create your repository

Click the "Use this template" button on GitHub to create your own repository from this template.

### 2. Clone and configure

```bash
# Clone your new repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Copy the example config
cp github.config.json.example github.config.json

# Edit github.config.json with your GitHub username and repository name
# Example:
# {
#   "username": "myusername",
#   "repository": "my-toybox",
#   "customization": {
#     "siteName": "My Portfolio",
#     "siteDescription": "My collection of Claude artifacts",
#     "showGitHubLink": true,
#     "defaultTheme": "auto"
#   }
# }

# Install dependencies
npm install

# Apply the configuration
npm run update-config
```

### 3. Start developing

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
├── src/
│   ├── artifacts/          # Your Claude-generated artifacts
│   ├── components/         # React components
│   ├── lib/               # Core functionality
│   └── main.tsx          # Application entry point
├── public/                # Static assets
├── TOYBOX_CONFIG.json    # Site configuration
├── github.config.json    # GitHub deployment config (git-ignored)
└── scripts/              # Build and setup scripts
```

## 🎨 Adding Artifacts

Create new artifacts in the `src/artifacts/` directory:

### Option 1: Single file artifact
```tsx
// src/artifacts/my-artifact.tsx
export const metadata = {
  id: "my-artifact",
  name: "My Artifact",
  type: "react" as const,
  description: "A cool artifact",
  created: new Date().toISOString()
};

export default function MyArtifact() {
  return <div>Hello from my artifact!</div>;
}
```

### Option 2: Directory-based artifact
```tsx
// src/artifacts/my-complex-artifact/index.tsx
export { metadata } from './metadata';
export { default } from './component';
```

## ⚙️ Configuration

This template uses a centralized configuration system to manage all deployment settings. See [`docs/CONFIGURATION.md`](docs/CONFIGURATION.md) for detailed documentation.

### Quick Setup

```bash
# Copy example configuration
cp github.config.json.example github.config.json

# Edit with your GitHub details
nano github.config.json

# Apply configuration to all files
npm run update-config

# Commit the configuration to your repository
git add github.config.json
git commit -m "Configure GitHub deployment settings"
```

### Configuration Files

**TOYBOX_CONFIG.json** - Site-wide configuration (title, description, theme)
**github.config.json** - GitHub deployment configuration (should be committed)

Example `github.config.json`:
```json
{
  "username": "your-username",
  "repository": "your-repo-name",
  "customization": {
    "siteName": "My Portfolio",
    "siteDescription": "My collection of Claude artifacts",
    "showGitHubLink": true,
    "defaultTheme": "auto"
  }
}
```

### Environment Overrides

For advanced deployments:
```bash
# Custom base URL
BASE_URL=/custom-path/ npm run build

# Override GitHub config
GITHUB_USERNAME=user GITHUB_REPOSITORY=repo npm run build
```

### Validation Scripts

```bash
# Validate current setup
npm run validate-setup

# Set up a new configuration from template
npm run setup

# Validate config before building (runs automatically in prebuild)
npm run validate-config
```

## 🚀 Deployment

This template is configured for GitHub Pages deployment:

1. Ensure GitHub Pages is enabled in your repository settings
2. Set the source to "GitHub Actions"
3. Push to the main branch or run `npm run deploy`
4. Your site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

## 📚 Technologies

- **React 18** with TypeScript
- **Vite** for fast builds and HMR
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Router** for navigation
- **GitHub Pages** for hosting

## 🤝 Contributing

This is a template repository. Feel free to customize it for your needs!

## 📄 License

MIT