import React, {useEffect, useRef, useState} from "react"
import {ChevronLeft, ChevronRight} from "lucide-react";
import { Transition } from '@headlessui/react'
import {textNumber} from "@/helper/utils";
import { commonConstants } from "@/constants";


export const Pagination = (props: {
    page: number,
    lastPage: number,
    setPage: any,
    path: string,
    choosePage?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(props.page);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: { target: any; }) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const goToPreviousPage = (e: React.MouseEvent) => {
        e.preventDefault();
        if (props.page === 1) return;
        settingPage(e, props.page - 1);
    }

    const goToNextPage = (e: React.MouseEvent) => {
        e.preventDefault();
        if (props.page === props.lastPage) return;
        settingPage(e, props.page + 1);
    }

    const settingPage = (e: React.MouseEvent, page: number) => {
        e.preventDefault();
        props.setPage(page);
    }

    const goToPage = () => {
        props.setPage(page);
        setOpen(false);
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <Transition 
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="flex justify-center">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 absolute bottom-14 p-4 bg-white">
                        <input type="number" value={page} onChange={(e) => setPage(parseInt(textNumber(e.target.value))) }
                            className="focus:outline-none w-20 mr-2 border px-2 py-1"/>
                        <button type="button" className="rounded text-white bg-indigo-500 font-bold px-8 py-1" onClick={goToPage}>GO</button>
                    </div>
                </div>
            </Transition>
            <div className="mx-3 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                       onClick={goToPreviousPage}>
                        戻る
                    </a>
                    <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                       onClick={goToNextPage}>
                        次へ
                    </a>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            { props.page === 1 ?
                                <>
                                    <span className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium text-gray-300 bg-gray-50">
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                    <span aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        1
                                    </span>
                                </> : <>
                                    <a href={props.path + '/page/' + (props.page - 1)} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                       aria-disabled={true} onClick={(e) => settingPage(e, props.page - 1)}>
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                    <a href={props.path + '/page/1' } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                       onClick={(e) => settingPage(e, 1)}>
                                        1
                                    </a>
                                </>
                            }
                            { props.page > 4 && props.lastPage > 5 && <span
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700`
                                    + (props.choosePage ? ' cursor-pointer' : '')}
                                onClick={() => {props.choosePage && setOpen(!open)}}>...</span>}

                            { (() => {
                                const indents = [];
                                if (props.page === 4 || (props.page === 5 && props.lastPage === 5)) {
                                    indents.push(<a href={props.path + '/page/2' } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={2}
                                                    onClick={(e) => settingPage(e, 2)}>
                                        2
                                    </a>);
                                }

                                if (props.page === 5 && props.lastPage === 5) {
                                    indents.push(<a href={props.path + '/page/3' } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={3}
                                                    onClick={(e) => settingPage(e, 3)}>
                                        3
                                    </a>);
                                }

                                if (props.lastPage > 2) {
                                    for (let i = props.page - 1; i < props.page + 2; i++) {
                                        if (i < 2 || i >= props.lastPage) continue;
                                        indents.push(props.page === i ?
                                            <span aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={i}>
                                                {i}
                                            </span> :
                                            <a href={props.path + '/page/2' } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={i}
                                               onClick={(e) => settingPage(e, i)}>
                                                {i}
                                            </a>);
                                    }
                                }

                                if (props.page === 1 && props.lastPage === 5) {
                                    indents.push(<a href={props.path + '/page/3' } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={3}
                                                    onClick={(e) => settingPage(e, 3)}>
                                        3
                                    </a>);
                                    indents.push(<a href={props.path + '/page/4' } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={4}
                                                    onClick={(e) => settingPage(e, 4)}>
                                        4
                                    </a>);
                                }

                                if ((props.page === (props.lastPage - 3) && props.lastPage > 4) || (props.lastPage === 4 && props.page === 1)) {
                                    indents.push( props.page === (props.lastPage - 1) ?
                                        <span aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={props.lastPage - 1}>
                                            {props.lastPage - 1}
                                        </span> :
                                        <a href={props.path + '/page/' + (props.lastPage - 1) } className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" key={props.lastPage - 1}
                                           onClick={(e) => settingPage(e, props.lastPage - 1)}>
                                            {props.lastPage - 1}
                                        </a>);
                                }

                                return indents;
                            })()}

                            { props.page < (props.lastPage - 3) && props.lastPage > 5 && <span
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700`
                                    + (props.choosePage ? ' cursor-pointer' : '')}
                                onClick={() => {props.choosePage && setOpen(!open)}}>...</span>}
                            { props.page === props.lastPage ?
                                <>
                                    <span aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                                        {props.lastPage}
                                    </span>
                                    <span className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium text-gray-300 bg-gray-50">
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </span>
                                </> : <>
                                    <a href={props.path + '/page/' + props.lastPage} className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                       onClick={(e) => settingPage(e, props.lastPage)}>
                                        {props.lastPage}
                                    </a>
                                    <a href={props.path + '/page/' + (props.page + 1) } className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                       onClick={(e) => settingPage(e, props.page + 1)}>
                                        <span className="sr-only">Next</span>
                                        <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                    </a>
                                </>
                            }
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}
