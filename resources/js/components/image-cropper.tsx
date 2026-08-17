import React, { Fragment, useEffect, useRef, useState } from "react";
import Cropper from "cropperjs";
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    notify,
} from "@/components";

interface ReactCropperElement extends HTMLImageElement {
    cropper: Cropper;
}

type ReactCropperRef =
    | ((instance: HTMLImageElement | ReactCropperElement | null) => void)
    | React.RefObject<HTMLImageElement | ReactCropperElement | null>
    | null;

interface ReactCropperDefaultOptions {
    scaleX?: number;
    scaleY?: number;
    enable?: boolean;
    zoomTo?: number;
    rotateTo?: number;
}

interface ReactCropperProps
    extends
        ReactCropperDefaultOptions,
        Cropper.Options<HTMLImageElement>,
        Omit<
            React.HTMLProps<HTMLImageElement>,
            "data" | "ref" | "crossOrigin"
        > {
    crossOrigin?: "" | "anonymous" | "use-credentials" | undefined;
    on?: (
        eventName: string,
        callback: () => void | Promise<void>,
    ) => void | Promise<void>;
    onInitialized?: (instance: Cropper) => void | Promise<void>;
    inputRef: React.RefObject<HTMLInputElement | null>;
    resultImage: any;
    title?: string;
    showData?: boolean;
    cropHeight?: number;
    cropWidth?: number;
}

const applyDefaultOptions = (
    cropper: Cropper,
    options: ReactCropperDefaultOptions = {},
): void => {
    const {
        enable = true,
        scaleX = 1,
        scaleY = 1,
        zoomTo = 0,
        rotateTo,
    } = options;
    enable ? cropper.enable() : cropper.disable();
    cropper.scaleX(scaleX);
    cropper.scaleY(scaleY);
    rotateTo !== undefined && cropper.rotateTo(rotateTo);
    zoomTo > 0 && cropper.zoomTo(zoomTo);
};

const useCombinedRefs = (...refs: ReactCropperRef[]) => {
    const targetRef = useRef<ReactCropperElement>(null);

    React.useEffect(() => {
        refs.forEach((ref) => {
            if (!ref) return;

            if (typeof ref === "function") {
                ref(targetRef.current);
            } else {
                ref.current = targetRef.current;
            }
        });
    }, [refs]);

    return targetRef;
};

const ImageCropper = React.forwardRef<
    ReactCropperElement | HTMLImageElement,
    ReactCropperProps
>(({ ...props }, ref) => {
    const {
        dragMode = "crop",
        style,
        className,
        crossOrigin,
        scaleX,
        scaleY,
        enable,
        zoomTo,
        rotateTo,
        alt = "picture",
        ready,
        onInitialized,
        ...rest
    } = props;

    const defaultOptions: ReactCropperDefaultOptions = {
        scaleY,
        scaleX,
        enable,
        zoomTo,
        rotateTo,
    };
    const innerRef = useRef<HTMLImageElement>(null);
    const combinedRef = useCombinedRefs(ref, innerRef);
    const [open, setOpen] = useState(false);
    const [src, setSrc] = useState("");
    const [cropWidth, setCropWidth] = useState(0);
    const [cropHeight, setCropHeight] = useState(0);

    const imageProps = React.useMemo(
        () => ({ crossOrigin, src, alt }),
        [crossOrigin, src, alt],
    );

    const cleanedMimes = () => {
        return "image/png, image/gif, image/jpeg, image/bmp, image/x-icon, image/svg+xml";
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileChange(e.target.files[0]);
        } else {
            return;
        }
    };

    const onFileChange = (file: File) => {
        const correctType = cleanedMimes()
            .split(", ")
            .find((mime) => mime === file.type);

        if (!correctType) {
            notify.error("画像ファイルを選択してください。");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setSrc(e.target?.result as string);
            setOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const closeModal = () => {
        setOpen(false);
        if (props.inputRef.current) {
            props.inputRef.current.value = "";
        }
    };

    const initCropper = () => {
        if (combinedRef.current !== null) {
            const cropper = new Cropper(combinedRef.current, {
                ...props,
                movable: false,
                zoomable: false,
                ready: (e) => {
                    if (e.currentTarget !== null) {
                        applyDefaultOptions(
                            e.currentTarget.cropper,
                            defaultOptions,
                        );
                    }
                    ready && ready(e);
                },
                crop(event: Cropper.CropEvent<HTMLImageElement>) {
                    let data = event.detail;
                    setCropWidth(Math.round(data.width));
                    setCropHeight(Math.round(data.height));
                },
            });
            onInitialized && onInitialized(cropper);
        }
    };

    const cropImage = () => {
        combinedRef.current?.cropper
            ?.getCroppedCanvas({
                width: props.cropWidth ?? 500,
                height: props.cropHeight ?? 500,
                imageSmoothingQuality: "high",
            })
            .toBlob((blob) => {
                props.resultImage(blob);
                closeModal();
            }, "image/webp");
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onAnimationEnd={() => initCropper()}>
                    <DialogTitle>{props.title ?? "作物のアバター"}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                    <div>
                        <img
                            {...imageProps}
                            ref={combinedRef}
                            alt={props.title}
                        />
                    </div>
                    {props.showData && (
                        <div className="flex">
                            <p>Width: {cropWidth}</p>
                            <p className="ml-4">Height: {cropHeight}</p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="ghost" onClick={closeModal}>
                            キャンセル
                        </Button>
                        <Button onClick={cropImage} className="w-20">
                            確定
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <input
                className="hidden"
                ref={props.inputRef}
                type="file"
                accept={cleanedMimes()}
                onChange={onFileInputChange}
            />
        </>
    );
});
export { ImageCropper };
