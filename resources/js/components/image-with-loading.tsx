import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithLoadingProps {
    width?: number;
    height?: number;
    src: string;
    noRatio?: boolean;
    alt?: string;
    className?: string;
}

export function ImageWithLoading({
    width,
    height,
    src,
    noRatio,
    alt,
    className,
}: ImageWithLoadingProps) {
    const [imageSrc, setImageSrc] = useState("");
    const [size, setSize] = useState("square");

    useEffect(() => {
        const image = new Image();
        const ratio = width && height ? width / height : 1;
        image.onload = () => {
            if (image.width / image.height < ratio && !noRatio)
                setSize("vertical");
            if (image.width / image.height > ratio && !noRatio)
                setSize("horizontal");
        };
        image.src = src;
        image.onerror = () => {
            setImageSrc("/img/default.png");
        };
        setImageSrc(src);
    }, [src]);

    const getImageClass = () => {
        if (size === "vertical") return cn("w-full", className);
        if (size === "horizontal") return cn("max-w-none", className);
        return cn("w-full", className);
    };

    const getWrapperClass = () => {
        let aspectRatio;
        if (!width || !height) {
            aspectRatio = "aspect-square";
        } else {
            aspectRatio = `aspect-[${width}/${height}]`;
        }

        if (noRatio) aspectRatio = "";

        if (size === "vertical") return `${aspectRatio} items-center`;
        if (size === "horizontal") return `${aspectRatio} justify-center`;
        return `${aspectRatio} items-center`;
    };
    return (
        <div className={`flex overflow-hidden ${getWrapperClass()}`}>
            {imageSrc !== "" ? (
                <img
                    src={imageSrc}
                    alt={alt ?? "image-banner-with-loading"}
                    className={getImageClass()}
                    width={width}
                    height={height}
                />
            ) : (
                <div className={"w-full animate-pulse bg-gray-200 h-full"} />
            )}
        </div>
    );
}
