import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { usePage, Link } from "@inertiajs/react";

import { getAdminRoute, textNumber } from "@/helper/utils";
import { Designer, FilterState } from "@/helper/type";
import { ChevronDown, ChevronUp, Plus, LoaderCircle, Search, X } from "lucide-react";

export interface FilterParams {
    keyword?: string;
    state?: number;
    designers?: string[];
    [key: string]: any;
}

interface FilterProps {
    filters?: FilterParams;
    onChange: (filters: FilterParams) => void;
    designerOptions?: Designer[];
}

export default ({ filters, onChange, designerOptions = [] }: FilterProps) => {
    const page = usePage<any>();
    const user = page.props.auth?.user;
    const role = user?.role || "user";
    const adminRoute = "admin";

    const [keyword, setKeyword] = useState(filters?.keyword ?? "");
    const [state, setState] = useState(filters?.state ?? 0);
    const [hideDesigner, setHideDesigner] = useState(true);
    const [selected, setSelected] = useState<string[]>(
        filters?.designers ?? []
    );
    const _isInit = useRef(true);

    useEffect(() => {
        setKeyword(filters?.keyword ?? "");
        setState(filters?.state ?? 0);
        setSelected(filters?.designers ?? []);
    }, [filters]);

    // Helper function to emit combined filters
    const emitFilters = (updates: Partial<FilterParams>) => {
        const newFilters: FilterParams = {
            keyword: updates.keyword !== undefined ? updates.keyword : keyword,
            state: updates.state !== undefined ? updates.state : state,
            designers:
                updates.designers !== undefined ? updates.designers : selected,
        };
        Object.keys(newFilters).forEach(
            (key) =>
                (newFilters[key] === undefined ||
                    newFilters[key] === 0 ||
                    newFilters[key]?.length === 0) &&
                delete newFilters[key]
        );
        onChange(newFilters);
    };

    const resetKeyword = () => {
        setKeyword("");
        emitFilters({ keyword: "" });
    };

    useEffect(() => {
        if (_isInit.current) {
            _isInit.current = false;
            return;
        }
        emitFilters({ state: state || undefined });
    }, [state]);

    const searchKeyword = () => {
        if (keyword.trim() === "") return;
        emitFilters({ keyword: keyword });
    };

    const showAllDesigner = () => {
        setHideDesigner(!hideDesigner);
    };

    const selectDesigner = (
        e: ChangeEvent<HTMLInputElement>,
        d: { id: number; name: string }
    ) => {
        const tmp = e.target.checked
            ? [...selected, d.name]
            : selected.filter((item) => item !== d.name);
        setSelected(tmp);
        emitFilters({ designers: tmp });
    };

    //select text color
    const isNegotiationActive = filters?.state == 2;
    return (
        <div className="mr-2 sticky top-4 overflow-y-auto h-screen h-screen-filter bg-gray-100 p-2 rounded">
            <div>
                <p className="font-medium flex justify-between">
                    ロゴ情報表示
                    <Link href={route("admin.logo")} className="p-1">
                        <Plus className="h-5 w-5 text-indigo-500" />
                    </Link>
                </p>
                <div className="flex mt-1">
                    <div className="relative">
                        <input
                            type="text"
                            className="px-2 py-2 rounded border focus:outline-none w-full border-r-0 rounded-r-none"
                            placeholder="ロゴID"
                            value={keyword}
                            onChange={(e) =>
                                setKeyword(textNumber(e.target.value.trim()))
                            }
                            onKeyDown={(e) => {
                                e.key === "Enter" && searchKeyword();
                            }}
                        />
                        {keyword.trim() !== "" && (
                            <span
                                className="absolute top-1 right-1 px-2 py-2 cursor-pointer"
                                onClick={resetKeyword}
                            >
                                <X className="w-5 h-5" />
                            </span>
                        )}
                    </div>
                    <span
                        className="px-2 py-2 cursor-pointer rounded border rounded-l-none flex items-center"
                        onClick={searchKeyword}
                    >
                        <Search className="w-5 h-5" />
                    </span>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center">
                        <input
                            id="stop"
                            name="state"
                            checked={state === 7}
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                            onChange={() => {}}
                            onClick={() => setState(state === 7 ? 0 : 7)}
                        />
                        <label
                            htmlFor="stop"
                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            停止中リスト
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="negotiation"
                            name="state"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                            checked={state === 2}
                            onChange={() => {}}
                            onClick={() => setState(state === 2 ? 0 : 2)}
                        />
                        <label
                            htmlFor="negotiation"
                            className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                        >
                            商談中リスト
                        </label>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <p className="font-medium">デザイナーリスト</p>
                <div
                    className={
                        `mt-2 space-y-3 transform duration-200 ` +
                        (hideDesigner ? "h-40 overflow-hidden" : "")
                    }
                >
                    {designerOptions.length === 0 && (
                        <div className="flex justify-center">
                            <LoaderCircle className="text-indigo-500 animate-spin" />
                        </div>
                    )}
                    {designerOptions.map((d) => (
                        <div
                            className="flex items-start"
                            key={`designer_${d.id}`}
                        >
                            <div className="flex items-center h-5">
                                <input
                                    id={`designer_${d.id}`}
                                    type="checkbox"
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
                                    checked={selected.includes(d.name)}
                                    onChange={(e) => selectDesigner(e, d)}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor={`designer_${d.id}`}
                                    className="font-medium text-gray-700 cursor-pointer"
                                >
                                    {d.name}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className="flex justify-center items-center text-teal-500 cursor-pointer"
                    onClick={showAllDesigner}
                >
                    {hideDesigner ? (
                        <>
                            <ChevronDown /> もっと見る
                        </>
                    ) : (
                        <>
                            <ChevronUp /> 閉まる
                        </>
                    )}
                </div>
            </div>
            {role === "admin" && (
                <>
                    <div className="mt-4">
                        <p className="font-medium">運営者用</p>
                        <ul>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1kpd5X3yvqFK8z35JMZpixIrTGWesP8R5DM6MoNtttZQ/edit#gid=582418742"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    新 販売管理
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1G8kwKpP1S9bGteb8tHtKQEIt3PvA6JCJ_RtH6r-5qXs/edit#gid=582418742"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    販売管理_jp-mix
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheet/ccc?key=0AszmjQM11gh2dEUxcUdZSWlyVFBHekp6WWlTeC1ST0E"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    旧 販売管理(2014年以前)
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://phpmyadmin-sv5126.xserver.jp"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    PHPMyadmin
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheet/ccc?key=0ArhJ8vceGPC8dGJQYnlOU1kxaURSYWNMbnNHY1pjMkE#gid=2"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    案件管理
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.google.com/analytics/web/#report/visitors-overview/a34536260w62106165p63670216/"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    アナリティクス
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1pyZrUUuvMELRk4YchOi9S0ofqxPxiGSGw5OA9eQxzEk/edit#gid=75382505&vpid=A1"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    納品書兼領収書
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="mt-4">
                        <p className="font-medium">デザイナー作業依頼</p>
                        <ul>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1yIWvFYcWNJ_KA5ueImxSchQN2yCnUKhm39pK8KLwVWg/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    牧野
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1aQVhAVon1XWwIpZH0hmiKm2uzM2c8RLsfYyKrTeuaZk/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    岸
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/18SU82UtyyxCHXgDzfTgdpw5jdVZf2s2E_i1O3EW3fuU/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    佐藤
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1fWWMFWn3Di4TUKIsxUswGR71lS-3pMVdVXs4gUObMx8/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    浜田
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1wabeFTg9mKgzuXbYMYcjJvxc46urxgtWhp1r_yEZZDo/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    森野
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1yauRMmn0yOEcqPea3mDHhSn7eDJI7sXCKrUWxjs-UFA/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    坂下
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://docs.google.com/spreadsheets/d/1m8hL5StN8wjs7B8ogIOxYFHqVc5LhfGt2s1AR7kLipc/edit#gid=0"
                                    target="_blank"
                                    className="text-indigo-500 hover:underline"
                                >
                                    竹村
                                </a>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};
