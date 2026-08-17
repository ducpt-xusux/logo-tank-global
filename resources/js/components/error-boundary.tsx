import React, { ErrorInfo, ReactNode } from "react";
import { logError } from "@/lib/logError";
import NotFound from "@/pages/not-found";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        if (import.meta.env.MODE !== "production") return;

        logError({
            message: error.message,
            stack: error.stack || "",
            componentStack: errorInfo.componentStack || undefined,
            url: window.location.href,
            type: "react-error-boundary",
        });
    }

    render() {
        if (this.state.hasError) {
            return <NotFound />;
        }

        return this.props.children;
    }
}

export { ErrorBoundary };
