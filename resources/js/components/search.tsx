import React, { useState } from "react";
import {
    Search as SearchIcon,
    X as XIcon,
} from "lucide-react";


export const Search = ({ initialConditions, onSearch, placeholder }: any) => {
    const [searchText, setSearchText] = useState("");
    const [conditions, setConditions] = useState<string[]>(initialConditions);

    const addCondition = () => {
        if (searchText.trim() === "") return;
        const newConditions = [searchText.trim()];
        setConditions(newConditions);
        onSearch(newConditions);
        setSearchText("");
    };

    const removeCondition = (index: number) => {
        const tmp = [...conditions];
        tmp.splice(index, 1);
        setConditions(tmp);
        onSearch(tmp);
    };

    return (
        <>
            <div className="flex flex-col md:flex-row mt-4 md:justify-between">
                <div className="mt-1 flex px-2 md:px-0">
                    <input
                        id="searchText"
                        name="searchText"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCondition()}
                        className="border w-96 max-w-lg px-4 py-2 rounded-l-md focus:outline-none"
                        placeholder={placeholder}
                    />
                    <span
                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm cursor-pointer"
                        onClick={() => addCondition()}
                    >
                        <SearchIcon className="w-5 h-5" />
                    </span>
                </div>
            </div>

            {conditions.length > 0 && (
                <div className="px-4 py-4 bg-gray-200 mt-2 rounded max-w-lg">
                    <p>検索条件</p>
                    <div className="mt-2">
                        {conditions.map((item, index) => (
                            <span
                                key={index}
                                className="relative border pl-2 pr-6 py-2 bg-white rounded leading-3 inline-block cursor-pointer hover:bg-gray-100 mr-1"
                                onClick={() => removeCondition(index)}
                            >
                                {item}
                                <XIcon className="w-5 h-5 text-gray-400 absolute right-0 top-1.5 px-1 py-1" />
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};
