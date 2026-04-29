const getTemplateStyles = () => `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #0f172a; background: #ffffff; margin: 0; padding: 0; }
    h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; line-height: 1.1; }
    h2 { font-size: 1.5rem; font-weight: 700; }
    h3 { font-size: 1.1rem; font-weight: 600; }
    .section { padding: 64px 48px; max-width: 960px; margin: 0 auto; }
    .cta-btn { background: #4f46e5; color: white; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-block; }
    ul { padding-left: 20px; }
    li { margin-bottom: 10px; line-height: 1.7; }
    .badge { display: inline-block; background: #eef2ff; color: #4f46e5; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
`;

export const buildHtmlDocument = (content, productName) => `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${productName} — Sales Page</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <style>${getTemplateStyles()}</style>
</head>
<body>
${content}
</body>
</html>`;