import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocaleLink } from "@/helper/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "@inertiajs/react";
interface LogoCardProps {
    id: number;
    image: string;
    badge?: {
        text: string;
        className?: string;
    };
    companyName: string;
    logoName: string;
    price: string;
    isLiked?: boolean;
    likes?: number;
    onLike?: (id: number, isLiked: boolean) => void;
    isCompact?: boolean;
}

export const LogoCard = ({
    id,
    image,
    badge,
    companyName,
    logoName,
    price,
    isLiked = false,
    likes = 0,
    onLike,
    isCompact = false,
}: LogoCardProps) => {
    return (
        <div className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md">
            {/* Image Container */}
            <div className="relative flex aspect-square items-center justify-center p-8">
                {/* Badge Container */}
                {!isCompact && (
                    <div className="absolute top-3 left-3 flex gap-2">
                        {badge && (
                            <Badge
                                className={cn(
                                    "rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase",
                                    badge.className,
                                )}
                            >
                                {badge.text}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Like Button */}
                {!isCompact && (
                    <div className="absolute top-3 right-3 z-20 flex cursor-pointer items-center gap-1">
                        <span className="text-xs text-gray-500">{likes}</span>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onLike && onLike(id, !isLiked);
                            }}
                            className="transition-colors hover:text-red-500"
                        >
                            <Heart
                                size={18}
                                className={cn(
                                    isLiked
                                        ? "fill-[#D81700] text-[#D81700]"
                                        : "text-gray-400",
                                )}
                            />
                        </button>
                    </div>
                )}

                {/* Logo Image */}
                <Link href={getLocaleLink(`/logo/detail/${id}`)}>
                    <img
                        src={image}
                        alt={logoName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/img/default.png";
                        }}
                    />
                </Link>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 border-t border-gray-100 p-4 text-center">
                <p className="text-[10px] text-gray-400 uppercase">
                    {companyName}
                </p>
                <p className="text-base font-bold text-[#474747]">{logoName}</p>
                {!isCompact && (
                    <p className="mt-1 text-sm font-semibold text-[#F3993F]">
                        {price}
                    </p>
                )}
            </div>
        </div>
    );
};
