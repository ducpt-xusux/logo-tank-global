import "../css/app.css";
import "../../node_modules/cropperjs/dist/cropper.css";
import "./helper/i18n";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@/components";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob("./pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const AppWithErrorBoundary =
            import.meta.env.MODE === "production" ? (
                <ErrorBoundary>
                    <App {...props} />
                </ErrorBoundary>
            ) : (
                <App {...props} />
            );
        root.render(AppWithErrorBoundary);
    },
    progress: {
        color: "#00A29A",
    },
});
