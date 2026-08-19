import {Fragment, useState} from 'react'
import { Dialog, DialogBackdrop, Transition } from '@headlessui/react'
import React from 'react'
import {LoaderCircle, CheckIcon, X} from "lucide-react";
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
    open: boolean,
    closeModal: () => void,
    overlay?: string,
    message: string,
    process: () => Promise<any>,
    afterLeave?: () => void
}

export const ConfirmModal = ({open, closeModal, overlay, message, process, afterLeave}: ConfirmModalProps) => {
    const [loading, setLoading] = useState(false);
    const [processed, setProcessed] = useState(false);
    const { i18n, t } = useTranslation('common', { useSuspense: false });
    const submit = () => {
        setLoading(true);
        process().then(() => {
            setProcessed(true);
            closeModal();
        }).catch(() => {}).then(() => setLoading(false));
    }
    const processAfterLeave = () => {
        processed && afterLeave && afterLeave();
    }

    return (
        <Transition appear show={open} as={Fragment} afterLeave={processAfterLeave} beforeEnter={() => setProcessed(false)}>
            <Dialog
                as="div"
                className="fixed inset-0 z-1000 overflow-y-auto"
                onClose={closeModal}
            >
                <div className="min-h-screen px-4 text-center opa">
                    <DialogBackdrop className={ overlay ? overlay : "fixed inset-0 bg-gray-200 opacity-75" } />
                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className={"inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle" +
                            " transition-all transform bg-white shadow-xl rounded-2xl"}>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">{t('shopping_cart.confirm') as string}</h3>
                            <p className="mt-2 text-sm">{message}</p>
                            <div className="flex justify-end">
                                <button type="button" onClick={closeModal}
                                        className={"inline-flex justify-center px-4 py-2 mt-2 w-28 text-sm font-medium" +
                                            " text-gray-900 bg-gray-100 border border-transparent rounded-md hover:bg-gray-200"+
                                            " focus:outline-none align-top"}
                                >
                                    <X className="w-5 h-5 inline-block" />
                                    {t('shopping_cart.no') as string}
                                </button>
                                <button type="button"
                                        className={"inline-flex justify-center px-4 py-2 mt-2 ml-4 w-28 text-sm font-medium"+
                                            " text-white bg-green-400 border border-transparent rounded-md hover:bg-green-500"+
                                            " focus:outline-none align-top"}
                                        onClick={submit}
                                >
                                    {loading ?
                                        <LoaderCircle />
                                        : <>
                                            <CheckIcon className="w-5 h-5 inline-block" />
                                            {t('shopping_cart.yes') as string}
                                        </>
                                    }
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    )
}
