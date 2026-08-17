import React from 'react';
import {ExternalToast, toast as sonnerToast} from 'sonner';
import {CircleAlert, CircleCheck, InfoIcon, TriangleAlert, XIcon} from "lucide-react";

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info';

interface Notify {
    (message: titleT, data?: ExternalToast): string | number;

    success(message: titleT | React.ReactNode, data?: ExternalToast): string | number;
    info(message: titleT | React.ReactNode, data?: ExternalToast): string | number;
    warning(message: titleT | React.ReactNode, data?: ExternalToast): string | number;
    error(message: titleT | React.ReactNode, data?: ExternalToast): string | number;
}

type titleT = (() => React.ReactNode) | React.ReactNode;
type ToastProps = {
    message: titleT
    type: ToastType
    id: string | number,
    data?: ExternalToast
}

function render(message: titleT, data?: ExternalToast, type: ToastType = 'default') {
    return sonnerToast.custom((id) => (
        <Notify
            message={message}
            type={type}
            id={id}
            data={data}
        />
    ));
}

function Notify(props: ToastProps) {
    const { message, type, id, data } = props;

    const icons = {
        success: <CircleCheck className="text-green-500" />,
        error: <CircleAlert className="text-red-500" />,
        warning: <TriangleAlert className="text-yellow-500" />,
        info: <InfoIcon className="text-blue-500" />,
        default: null,
    }
    const icon = icons[type] || icons.default;

    return (
        <div
            className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4"
        >
            <div className="flex flex-1 items-center gap-3 relative">
                <div>
                    {icon}
                </div>
                <div className="w-full">
                    <p className="mt-1 text-sm">{typeof message === 'function' ? message() : message}</p>
                </div>
            </div>
            <span
                className="absolute top-1.5 right-1.5 cursor-pointer p-0.5"
                onClick={() => sonnerToast.dismiss(id)}
            >
                <XIcon size={16} />
            </span>
        </div>
    );
}

export const notify: Notify = Object.assign(
    (message: titleT, data?: ExternalToast) => render(message, data),
    {
        success: (message: titleT, data?: ExternalToast) => render(message, data, 'success'),
        info: (message: titleT, data?: ExternalToast) => render(message, data, 'info'),
        warning: (message: titleT, data?: ExternalToast) => render(message, data, 'warning'),
        error: (message: titleT, data?: ExternalToast) => render(message, data, 'error'),
    }
);
