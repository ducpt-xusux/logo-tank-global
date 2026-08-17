import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageSliderProps {
    images?: string[];
    items?: React.ReactNode[];
    alt?: string;
    className?: string;
    imageClassName?: string;
    aspectRatio?: string;
    currentIndex?: number;
    onIndexChange?: (index: number) => void;
    hideNavigation?: boolean;
    hideIndicators?: boolean;
    visibleItems?: number;
    gap?: number;
    arrowStyle?: "default" | "orange" | "dark";
    arrowPlacement?: "inside" | "outside";
}

export function ImageSlider({
    images,
    items: externalItems,
    alt = "Logo Image",
    className,
    imageClassName,
    aspectRatio = "aspect-square",
    currentIndex: externalIndex,
    onIndexChange,
    hideNavigation = false,
    hideIndicators = false,
    visibleItems = 1,
    gap = 4,
    arrowStyle = "default",
    arrowPlacement = "outside",
}: ImageSliderProps) {
    const [internalIndex, setInternalIndex] = useState(0);

    const isControlled = externalIndex !== undefined;
    const currentIndex: number = isControlled ? externalIndex : internalIndex;

    // Normalize items: either externalItems or images mapped to img tags
    const items =
        externalItems ||
        (images || []).map((img, index) => (
            <div
                key={index}
                className={cn(
                    "flex h-full w-full items-center justify-center bg-white",
                    aspectRatio,
                )}
            >
                <img
                    src={img}
                    alt={`${alt} ${index + 1}`}
                    className={cn(
                        "max-h-full max-w-full object-contain",
                        imageClassName,
                    )}
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/img/default.png";
                    }}
                />
            </div>
        ));

    const totalItems = items.length;
    const maxIndex = Math.max(0, totalItems - visibleItems);

    const setIndex = (index: number) => {
        const newIndex = Math.min(Math.max(0, index), maxIndex);
        if (!isControlled) {
            setInternalIndex(newIndex);
        }
        if (onIndexChange) {
            onIndexChange(newIndex);
        }
    };

    const nextSlide = () => {
        if (currentIndex < maxIndex) {
            setIndex(currentIndex + 1);
        } else {
            setIndex(0); // Optional: Loop back to start
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setIndex(currentIndex - 1);
        } else {
            setIndex(maxIndex); // Optional: Loop to end
        }
    };

    useEffect(() => {
        if (currentIndex > maxIndex) {
            setIndex(maxIndex);
        }
    }, [maxIndex]);

    if (!items || totalItems === 0) {
        return (
            <div
                className={cn(
                    "flex w-full items-center justify-center bg-gray-100",
                    aspectRatio,
                    className,
                )}
            >
                <img
                    src="/img/default.png"
                    alt="No image"
                    className="max-h-full max-w-full object-contain"
                />
            </div>
        );
    }

    if (totalItems === 1 && visibleItems === 1) {
        return (
            <div
                className={cn(
                    "flex w-full items-center justify-center bg-white",
                    aspectRatio,
                    className,
                )}
            >
                {items[0]}
            </div>
        );
    }

    return (
        <div className={cn("group relative w-full", className)}>
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
                        gap: `2px`,
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="shrink-0"
                            style={{
                                width: `calc(${100 / visibleItems}% - ${(gap * 0.25 * (visibleItems - 1)) / visibleItems}rem)`,
                            }}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {!hideNavigation && totalItems > visibleItems && (
                <>
                    <button
                        onClick={prevSlide}
                        className={cn(
                            "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all",
                            arrowPlacement === "inside" ? "left-6" : "-left-4",
                            arrowStyle === "orange"
                                ? "bg-[#F3993F] text-white hover:bg-[#E67E00]"
                                : arrowStyle === "dark"
                                  ? "bg-[#4A4A4A] text-white hover:bg-[#333333]"
                                  : "bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-white",
                        )}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className={cn(
                            "absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all",
                            arrowPlacement === "inside"
                                ? "right-6"
                                : "-right-4",
                            arrowStyle === "orange"
                                ? "bg-[#F3993F] text-white hover:bg-[#E67E00]"
                                : arrowStyle === "dark"
                                  ? "bg-[#4A4A4A] text-white hover:bg-[#333333]"
                                  : "bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-white",
                        )}
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </>
            )}

            {/* Indicators */}
            {!hideNavigation && !hideIndicators && visibleItems === 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {items.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setIndex(index)}
                            className={cn(
                                "h-2.5 w-2.5 rounded-full transition-all",
                                currentIndex === index
                                    ? "w-6 bg-[#F3993F]"
                                    : "bg-gray-300 hover:bg-gray-400",
                            )}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
