import { LoaderCircle } from "lucide-react";

interface LogoImageSlotsProps {
    canEdit: boolean;
    processing: boolean;
    submitTarget: "detail" | "categories" | "image" | null;
    selectedFiles: Record<number, File>;
    previewUrls: Record<number, string>;
    itemData: any;
    submitImages: () => void;
    handleUploadClick: (slot: number) => void;
    handleDeleteFile: (slot: number) => void;
}

export const LogoImageSlots = ({
    canEdit,
    processing,
    submitTarget,
    selectedFiles,
    previewUrls,
    itemData,
    submitImages,
    handleUploadClick,
    handleDeleteFile,
}: LogoImageSlotsProps) => {
    return (
        <div className="px-4 py-4">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="font-medium">
                        ロゴ画像を管理してください(最大6枚)。
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        ※ .gif, .png | 400px x 400px
                    </p>
                </div>
                <button
                    type="button"
                    onClick={submitImages}
                    disabled={
                        !canEdit ||
                        Object.keys(selectedFiles).length === 0 ||
                        (processing && submitTarget === "image")
                    }
                    className="rounded bg-blue-600 px-6 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {processing && submitTarget === "image"
                        ? "SUBMITTING..."
                        : "SUBMIT"}
                </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((slot) => {
                    const fileUrl = previewUrls[slot];
                    const existing = itemData?.logo_images?.find(
                        (img: any) => img.sort_order === slot
                    );
                    const displayUrl = fileUrl || existing?.url;

                    return (
                        <div
                            key={slot}
                            className="flex h-72 flex-col rounded border bg-white p-3 shadow-sm"
                        >
                            <div className="mb-2 border-b pb-2 text-center text-xs font-bold text-gray-500">
                                SLOT {slot} {slot === 1 ? "(MAIN)" : ""}
                            </div>
                            <div className="relative mb-3 flex w-full flex-1 items-center justify-center overflow-hidden rounded border border-dashed bg-gray-50">
                                {displayUrl ? (
                                    <img
                                        src={displayUrl}
                                        className="h-full w-full object-contain"
                                        alt={`Slot ${slot}`}
                                    />
                                ) : (
                                    <p className="text-sm font-medium text-gray-300">
                                        No image
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {displayUrl ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleUploadClick(slot)}
                                            className="flex-1 rounded border bg-gray-100 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
                                        >
                                            編集
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteFile(slot)}
                                            className="flex-1 rounded border border-red-100 bg-red-50 py-1.5 text-xs text-red-500 hover:bg-red-100"
                                        >
                                            削除
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleUploadClick(slot)}
                                        className="w-full rounded border bg-gray-100 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
                                    >
                                        アップロード
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
