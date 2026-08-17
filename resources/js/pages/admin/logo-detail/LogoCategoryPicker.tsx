import { ChangeEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { LogoDetailFormData } from "./types";

interface LogoCategoryPickerProps {
    data: LogoDetailFormData;
    normalizedColors: any[];
    normalizedAlphabets: any[];
    normalizedIndustries: any[];
    normalizedTastes: any[];
    toggleCategoryItem: (type: "colors" | "industries" | "tastes", id: number, checked: boolean) => void;
    toggleAlphabet: (id: number, checked: boolean) => void;
    handleSelectAllAlphabets: (event: ChangeEvent<HTMLInputElement>) => void;
    saveCategories: () => void;
    processing: boolean;
    submitTarget: "detail" | "categories" | "image" | null;
}

export const LogoCategoryPicker = ({
    data,
    normalizedColors,
    normalizedAlphabets,
    normalizedIndustries,
    normalizedTastes,
    toggleCategoryItem,
    toggleAlphabet,
    handleSelectAllAlphabets,
    saveCategories,
    processing,
    submitTarget,
}: LogoCategoryPickerProps) => {
    return (
        <div className="grid grid-cols-4 px-2 py-2">
            <div className="col-span-2">
                <p className="font-medium">ジャンルを選択</p>
                <div className="mt-2 space-y-2">
                    {normalizedColors.map((color) => (
                        <div className="flex items-start" key={`color_${color.id}`}>
                            <div className="flex h-5 items-center">
                                <input
                                    id={`color_${color.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.colors.includes(color.id)}
                                    onChange={(event) =>
                                        toggleCategoryItem(
                                            "colors",
                                            color.id,
                                            event.target.checked
                                        )
                                    }
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor={`color_${color.id}`}
                                    className="cursor-pointer font-medium text-gray-700"
                                >
                                    {color.name_ja}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="mt-2 font-medium">アルファベットを選択</p>
                <div>
                    <div className="flex items-start">
                        <div className="flex h-5 items-center">
                            <input
                                id="alphabet_all"
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={
                                    normalizedAlphabets.length > 0 &&
                                    data.alphabets.length ===
                                        normalizedAlphabets.length
                                }
                                onChange={handleSelectAllAlphabets}
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label
                                htmlFor="alphabet_all"
                                className="cursor-pointer font-medium text-gray-700"
                            >
                                全選択
                            </label>
                        </div>
                    </div>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1">
                    {normalizedAlphabets.map((alphabet) => (
                        <div
                            className="flex items-start"
                            key={`alphabet_${alphabet.alphabet_id}`}
                        >
                            <div className="flex h-5 items-center">
                                <input
                                    id={`alphabet_${alphabet.alphabet_id}`}
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.alphabets.includes(
                                        alphabet.alphabet_id
                                    )}
                                    onChange={(event) =>
                                        toggleAlphabet(
                                            alphabet.alphabet_id,
                                            event.target.checked
                                        )
                                    }
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor={`alphabet_${alphabet.alphabet_id}`}
                                    className="cursor-pointer font-medium text-gray-700"
                                >
                                    {alphabet.name}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <p className="font-medium">業種を選択</p>
                <div className="mt-2 space-y-2">
                    {normalizedIndustries.map((industry) => (
                        <div className="flex items-start" key={`industry_${industry.id}`}>
                            <div className="flex h-5 items-center">
                                <input
                                    id={`industry_${industry.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.industries.includes(industry.id)}
                                    onChange={(event) =>
                                        toggleCategoryItem(
                                            "industries",
                                            industry.id,
                                            event.target.checked
                                        )
                                    }
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor={`industry_${industry.id}`}
                                    className="cursor-pointer font-medium text-gray-700"
                                >
                                    {industry.name_ja}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <p className="font-medium">ジャンルを選択</p>
                <div className="mt-2 space-y-2">
                    {normalizedTastes.map((taste) => (
                        <div className="flex items-start" key={`taste_${taste.id}`}>
                            <div className="flex h-5 items-center">
                                <input
                                    id={`taste_${taste.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={data.tastes.includes(taste.id)}
                                    onChange={(event) =>
                                        toggleCategoryItem(
                                            "tastes",
                                            taste.id,
                                            event.target.checked
                                        )
                                    }
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label
                                    htmlFor={`taste_${taste.id}`}
                                    className="cursor-pointer font-medium text-gray-700"
                                >
                                    {taste.name_ja}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-span-2 mt-2 flex justify-center">
                <button
                    className="flex h-10 w-20 items-center justify-center rounded bg-indigo-500 text-white"
                    onClick={saveCategories}
                    type="button"
                >
                    {processing && submitTarget === "categories" ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        "保存"
                    )}
                </button>
            </div>
        </div>
    );
};
