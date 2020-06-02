import './style.scss';
import { ContextMenu } from './src/ContextMenu';

declare global {
  interface Window { contextmenu: any; }
}

window.contextmenu = ContextMenu || {};
