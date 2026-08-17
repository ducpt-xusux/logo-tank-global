interface ClientError {
    message: string;
    stack?: string;
    componentStack?: string;
    url: string;
    type?: string;
    timestamp?: string;
    userAgent?: string;
}

let errorQueue: ClientError[] = [];
let sending = false;
let lastSent = 0;
const THROTTLE_MS = 30000;

export function logError(errorData: ClientError): void {
    if (import.meta.env.MODE !== 'production') return;

    const enrichedError: ClientError = {
        ...errorData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
    };

    errorQueue.push(enrichedError);

    const now = Date.now();

    if (!sending && now - lastSent >= THROTTLE_MS) {
        sending = true;
        lastSent = now;

        const payload = errorQueue.pop(); // Lấy lỗi cuối cùng
        errorQueue = [];

        fetch('/api/log-client-error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify(payload),
        })
            .catch((err) => {
                console.warn('Failed to report client error:', err);
            })
            .finally(() => {
                sending = false;
            });
    }
}
