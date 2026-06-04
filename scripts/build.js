#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const root = path.resolve(__dirname, '..');
const data = yaml.load(fs.readFileSync(path.join(root, 'tools.yaml'), 'utf8'));

const grouped = {};
data.categories.forEach(cat => { grouped[cat] = []; });
data.tools.forEach(tool => {
  if (grouped[tool.category]) grouped[tool.category].push(tool);
});

const pricingIcon = { Free: '🟢', Freemium: '🟡', Paid: '🔴' };

const lines = [
  '# Awesome AI Tools',
  '',
  '> A curated list of AI tools across categories.',
  '',
  `![Tools](https://img.shields.io/badge/tools-${data.tools.length}-blue)`,
  `![Categories](https://img.shields.io/badge/categories-${data.categories.length}-green)`,
  '',
  '🟢 Free · 🟡 Freemium · 🔴 Paid',
  '',
  '---',
  '',
  '## Contents',
  '',
];

data.categories.forEach(cat => {
  if (!grouped[cat].length) return;
  const anchor = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '');
  lines.push(`- [${cat}](#${anchor})`);
});

lines.push('', '---', '');

data.categories.forEach(cat => {
  const tools = grouped[cat];
  if (!tools.length) return;
  lines.push(`## ${cat}`, '');
  lines.push('| Tool | Description | Pricing |');
  lines.push('|------|-------------|---------|');
  tools.forEach(tool => {
    const icon = pricingIcon[tool.pricing] || '';
    lines.push(`| [${tool.name}](${tool.url}) | ${tool.description} | ${icon} ${tool.pricing} |`);
  });
  lines.push('');
});

lines.push(
  '---',
  '',
  '## Contributing',
  '',
  'Edit `tools.yaml` to add or update tools. `README.md` is auto-generated — do not edit it directly.',
  '',
);

fs.writeFileSync(path.join(root, 'README.md'), lines.join('\n'));
console.log('README.md generated: %d tools, %d categories', data.tools.length, data.categories.length);
