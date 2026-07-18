import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
`import { TradingProvider } from './TradingContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider, useTheme } from './ThemeContext';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';

import { ReferralPage } from './pages/ReferralPage';`,
  ''
);

fs.writeFileSync('src/App.tsx', content);
