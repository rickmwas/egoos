import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker if available
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch((err) => {
			// Not fatal — log for debugging
			// eslint-disable-next-line no-console
			console.warn('Service worker registration failed:', err);
		});
	});
}
