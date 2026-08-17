import React from 'react';
import {Head, Link} from "@inertiajs/react";
import {AppLayout, ImageWithLoading} from "@/components";

export default function NotFound() {
    return <AppLayout>
        <Head title="Not Found" />
        <div className="grow flex flex-col justify-center">
            <div className="flex justify-center">
                <ImageWithLoading src="/img/404.svg" width={600} height={373} alt="404" className="max-w-xl" />
            </div>

            <div className="mt-5 flex justify-center">
                <Link
                    href={'/'}
                    className="flex border rounded-full px-5 py-2 text-white bg-teal-600 text-sm font-bold"
                >
                    ホームに戻る
                </Link>
            </div>
        </div>
    </AppLayout>
}