# Instructions for GitHub Hosting

This project is built using React + Vite. To host it on GitHub Pages or any other static host:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   - For GitHub Pages, you can use the `dist` folder.
   - Note: This project uses Firebase. Ensure you have your `firebase-applet-config.json` correctly set up in the root or environment variables.

4. **Environment Variables**:
   In AI Studio, secrets are managed via the Secrets panel. If moving to GitHub, you need to add your `GEMINI_API_KEY` to your CI/CD secrets or a `.env` file.

## Features
- **Player Registration**: Camera support (requires HTTPS).
- **QR Codes**: Auto-generated for each player.
- **Dynamic Dashboard**: Animated stats.
- **RTL Support**: Built specifically for Arabic language.
