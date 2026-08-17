import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Home, Grid, Tag, Pipette } from "lucide-react";
import { cn, getLocalizedName } from "@/helper/utils";
import { Industry, Color, Taste } from "@/types";
import { getLocaleLink } from "@/helper/utils";

interface HeroSearchBoxProps {
    className?: string;
    industries?: Industry[];
    colors?: Color[];
    tastes?: Taste[];
    initialFilters?: {
        keyword?: string;
        industry?: string;
        alphabet?: string;
        taste?: string;
        color?: string;
    };
}

export function HeroSearchBox({
    className,
    industries,
    colors,
    tastes,
    initialFilters,
}: HeroSearchBoxProps) {
    const { t } = useTranslation("common", { useSuspense: false });
    const [keyword, setKeyword] = useState(initialFilters?.keyword ?? "");
    const [industry, setIndustry] = useState<string>(
        initialFilters?.industry ?? "",
    );
    const [alphabet, setAlphabet] = useState<string>(
        initialFilters?.alphabet ?? "",
    );
    const [taste, setTaste] = useState<string>(initialFilters?.taste ?? "");
    const [color, setColor] = useState<string>(initialFilters?.color ?? "");

    useEffect(() => {
        setKeyword(initialFilters?.keyword ?? "");
        setIndustry(initialFilters?.industry ?? "");
        setAlphabet(initialFilters?.alphabet ?? "");
        setTaste(initialFilters?.taste ?? "");
        setColor(initialFilters?.color ?? "");
    }, [initialFilters]);
    const handleSearch = () => {
        const params: Record<string, string> = {};

        if (keyword) params.keyword = keyword;
        if (industry) params.industry = industry;
        if (alphabet) params.alphabet = alphabet;
        if (taste) params.taste = taste;
        if (color) params.color = color;
        router.get(getLocaleLink("/explore"), params, {
            preserveState: true,
        });
    };

    return (
        <div
            className={cn(
                "rounded-lg bg-white p-4 shadow-lg md:px-6 md:py-5 lg:px-4 lg:py-4",
                className,
            )}
        >
            <div className="relative mb-4">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t("home.searchBox.placeHolder")}
                    className="h-12 w-full rounded-md bg-[#F2F2F2] px-4 pr-10 text-[15px] outline-none md:h-[54px] md:text-[16px]"
                />
                <Search className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-500" />
            </div>
            <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <div className="flex-1">
                        <Select
                            value={industry}
                            onValueChange={(value) => setIndustry(value)}
                        >
                            <SelectTrigger className="border-none bg-[#F2F2F2] md:h-12 md:text-[15px]">
                                <div className="flex items-center gap-2">
                                    <Home className="h-4 w-4" />
                                    <SelectValue
                                        placeholder={t(
                                            "home.searchBox.industry",
                                        )}
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent sideOffset={10}>
                                <div className="space-y-3 p-4">
                                    <div className="font-bold md:text-xl">
                                        {t("home.searchBox.industry")}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        {industries?.map((industry) => (
                                            <SelectItem
                                                key={industry.id}
                                                value={industry.id.toString()}
                                            >
                                                {getLocalizedName(industry)}
                                            </SelectItem>
                                        ))}
                                    </div>
                                </div>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Select
                            value={alphabet}
                            onValueChange={(value) => setAlphabet(value)}
                        >
                            <SelectTrigger className="border-none bg-[#F2F2F2] md:h-12 md:text-[15px]">
                                <div className="flex items-center gap-2">
                                    <Grid className="h-4 w-4" />
                                    <SelectValue
                                        placeholder={t(
                                            "home.searchBox.alphabet",
                                        )}
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent sideOffset={10}>
                                <div className="space-y-3 p-4">
                                    <div className="font-bold md:text-xl">
                                        {t("home.searchBox.alphabet")}
                                    </div>
                                    <div className="grid grid-cols-5">
                                        {"abcdefghijklmnopqrstuvwxyz"
                                            .split("")
                                            .map((char) => (
                                                <SelectItem
                                                    key={char}
                                                    value={char}
                                                >
                                                    {char.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                    </div>
                                </div>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Select
                            value={taste}
                            onValueChange={(value) => setTaste(value)}
                        >
                            <SelectTrigger className="border-none bg-[#F2F2F2] md:h-12 md:text-[15px]">
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    <SelectValue
                                        placeholder={t(
                                            "home.searchBox.category",
                                        )}
                                    />
                                </div>
                            </SelectTrigger>

                            <SelectContent sideOffset={10}>
                                <div className="space-y-3 p-4">
                                    <div className="font-bold md:text-xl">
                                        {t("home.searchBox.category")}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        {tastes?.map((taste) => (
                                            <SelectItem
                                                key={taste.id}
                                                value={taste.id.toString()}
                                                className=""
                                            >
                                                {getLocalizedName(taste)}
                                            </SelectItem>
                                        ))}
                                    </div>
                                </div>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1">
                        <Select
                            value={color}
                            onValueChange={(value) => setColor(value)}
                        >
                            <SelectTrigger className="border-none bg-[#F2F2F2] md:h-12 md:text-[15px]">
                                <div className="flex items-center gap-2">
                                    <Pipette className="h-4 w-4" />
                                    <SelectValue
                                        placeholder={t("home.searchBox.color")}
                                    />
                                </div>
                            </SelectTrigger>
                            <SelectContent sideOffset={10}>
                                <div className="space-y-3 p-4">
                                    <div className="font-bold md:text-xl">
                                        {t("home.searchBox.color")}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        {colors?.map((color) => (
                                            <SelectItem
                                                key={color.id}
                                                value={color.id.toString()}
                                                className=""
                                            >
                                                {getLocalizedName(color)}
                                            </SelectItem>
                                        ))}
                                    </div>
                                </div>
                            </SelectContent>
                        </Select>
                    </div>
                <div className="flex-1 mt-4 md:mt-0">
                    <button
                        className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-base bg-brand inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-md px-8 py-2 text-[15px] font-medium whitespace-nowrap text-white uppercase shadow-xs transition-[color,box-shadow] outline-none hover:bg-[#E67A00] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 md:h-12 md:w-full md:text-[16px] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                        onClick={handleSearch}
                    >
                        {t("home.searchBox.searchButton")}
                    </button>
                </div>
            </div>
            <div className="mt-4 text-center text-[12px] text-gray-500 md:text-[13px]">
                {t("home.searchBox.note")}
            </div>
        </div>
    );
}
