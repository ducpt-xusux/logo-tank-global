import {
    ChangeEvent,
    FormEventHandler,
    useMemo,
    useRef,
    useState,
} from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";
import { AdminLayout } from "@/components";
import { ImageWithLoading } from "@/components";
import { LogoCropper } from "@/components/logo-cropper";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { classNames } from "@/helper/utils";
import { toast } from "react-toastify";
import { Alphabets, Color, Industry, Logo, Taste } from "@/helper/type";
import { LogoDetailFormData } from "./logo-detail/types";
import { LogoBasicsForm } from "./logo-detail/LogoBasicsForm";
import { LogoImageSlots } from "./logo-detail/LogoImageSlots";
import { LogoCategoryPicker } from "./logo-detail/LogoCategoryPicker";
import { LogoKeywordPanel } from "./logo-detail/LogoKeywordPanel";
const categories = [
    { id: 1, name: "基本情報" },
    { id: 2, name: "画像" },
    { id: 3, name: "カテゴリ" },
    { id: 4, name: "キーワード" },
];

interface LogoDetailProps {
    item: Logo;
    colorsList: Color[];
    industriesList: Industry[];
    tastesList: Taste[];
    alphabetsList: Alphabets[];
    designerList: { id: number; name: string }[];
    tab?: string;
}

const getTabIndex = (tab?: string) => {
    if (tab === "image") return 1;
    if (tab === "category") return 2;
    if (tab === "keyword") return 3;
    return 0;
};

const getCollectionIds = <T extends Record<string, any>>(
    value: T[] | { data?: T[] } | undefined,
    key: keyof T,
) => {
    if (Array.isArray(value)) {
        return value.map((entry) => Number(entry[key]));
    }
    const data = (value as { data?: T[] } | undefined)?.data;
    if (!Array.isArray(data)) {
        return [];
    }
    return data.map((entry) => Number(entry[key]));
};

const buildOptions = (designers: { id: number; name: string }[]) => {
    return [
        { id: 0, name: "ー選択ー", value: "" },
        ...designers.map((designer) => ({
            id: designer.id,
            name: designer.name,
            value: designer.name,
        })),
    ];
};

export default function LogoDetail({
    item,
    colorsList,
    industriesList,
    tastesList,
    alphabetsList,
    designerList,
    tab,
}: LogoDetailProps) {
    const { auth } = usePage().props as any;
    const role = auth?.user?.role ?? "user";
    const trigger = useRef<HTMLInputElement>(null);
    const itemData = (item as any)?.data ?? item;
    const logoId = itemData?.logo_id ?? null;
    const isCreating = !logoId;
    const canEdit = Boolean(logoId);
    const initialTabIndex = canEdit === true ? getTabIndex(tab) : 0;

    const [logoSrc, setLogoSrc] = useState(itemData?.src ?? "");
    const [submitTarget, setSubmitTarget] = useState<
        "detail" | "categories" | "image" | null
    >(null);

    const [selectedFiles, setSelectedFiles] = useState<Record<number, File>>(
        {},
    );
    const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});
    const [activeSlot, setActiveSlot] = useState<number | null>(null);

    const { data, setData, post, errors, processing, transform } =
        useForm<LogoDetailFormData>({
            logo_name: itemData?.logo_name ?? "",
            logo_name_vn: itemData?.logo_language?.vi ?? "",
            logo_name_en: itemData?.logo_language?.en ?? "",
            logo_explain: itemData?.logo_explain ?? "",
            logo_d_id: itemData?.logo_d_id ?? "",
            reg_by: itemData?.reg_by ?? "",
            colors: getCollectionIds(itemData?.colors, "id"),
            industries: getCollectionIds(itemData?.industries, "id"),
            tastes: getCollectionIds(itemData?.tastes, "id"),
            alphabets: getCollectionIds(itemData?.alphabets, "alphabet_id"),
            image: null,
        });

    const designerOptions = useMemo(
        () => buildOptions(designerList),
        [designerList],
    );
    const selectedDesigner = useMemo(() => {
        const found = designerOptions.find(
            (option) => option.value === data.reg_by,
        );
        return found || designerOptions[0];
    }, [designerOptions, data.reg_by]);

    const submitDetail: FormEventHandler = (event) => {
        event.preventDefault();
        if (isCreating) {
            transform((data) => data);
            post(route("admin.logo.store"), {
                preserveState: false,
                preserveScroll: true,
                onStart: () => setSubmitTarget("detail"),
                onSuccess: () => {
                    toast.success("登録しました。");
                },
                onFinish: () => setSubmitTarget(null),
            });
            return;
        }
        transform((data) => ({
            ...data,
            _method: "PATCH",
        }));
        post(route("admin.logo.update", logoId), {
            preserveScroll: true,
            forceFormData: true,
            onStart: () => setSubmitTarget("detail"),
            onSuccess: () => {
                toast.success("更新しました。");
            },
            onFinish: () => setSubmitTarget(null),
        });
    };

    const saveCategories = () => {
        if (!canEdit) {
            toast.info("先に基本情報を保存してください。");
            return;
        }
        transform((data) => data);
        post(route("admin.logo.update-categories", logoId), {
            preserveScroll: true,
            onStart: () => setSubmitTarget("categories"),
            onSuccess: () => {
                toast.success("更新しました。");
            },
            onFinish: () => setSubmitTarget(null),
        });
    };

    const handleUploadClick = (slotIndex: number) => {
        if (!canEdit) {
            toast.info("先に基本情報を保存してください。");
            return;
        }
        setActiveSlot(slotIndex);
        trigger.current?.click();
    };

    const handleInputFile = (fileBlob: Blob) => {
        if (!canEdit || !activeSlot) {
            return;
        }
        const file = new File([fileBlob], `logo-${logoId}-${activeSlot}.png`, {
            type: fileBlob.type || "image/png",
        });

        setSelectedFiles((prev) => ({ ...prev, [activeSlot]: file }));
        setPreviewUrls((prev) => ({
            ...prev,
            [activeSlot]: URL.createObjectURL(file),
        }));

        if (activeSlot === 1) {
            setLogoSrc(URL.createObjectURL(file));
        }
    };

    const handleDeleteFile = (slotIndex: number) => {
        if (selectedFiles[slotIndex]) {
            setSelectedFiles((prev) => {
                const next = { ...prev };
                delete next[slotIndex];
                return next;
            });
            setPreviewUrls((prev) => {
                const next = { ...prev };
                delete next[slotIndex];
                return next;
            });
            return;
        }

        const existing = itemData?.logo_images?.find(
            (img: any) => img.sort_order === slotIndex,
        );
        if (existing) {
            if (confirm("この画像を完全に削除しますか？")) {
                router.delete(
                    route("admin.logo.delete-image", [logoId, slotIndex]),
                    {
                        preserveScroll: true,
                        onSuccess: () => toast.success("画像を削除しました。 "),
                        onError: () =>
                            toast.error("削除中にエラーが発生しました"),
                    },
                );
            }
        }
    };

    const submitImages = () => {
        if (!canEdit) {
            toast.info("先に基本情報を保存してください。");
            return;
        }
        if (Object.keys(selectedFiles).length === 0) {
            toast.info("画像が選択されていません");
            return;
        }

        router.post(
            route("admin.logo.update-images", logoId),
            { images: selectedFiles },
            {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setSubmitTarget("image"),
                onSuccess: () => {
                    toast.success("画像の更新に成功しました！");
                    setSelectedFiles({});
                    setPreviewUrls({});
                },
                onError: () => {
                    toast.error("アップロード中にエラーが発生しました。");
                },
                onFinish: () => setSubmitTarget(null),
            },
        );
    };

    const toggleCategoryItem = (
        key: "colors" | "industries" | "tastes",
        id: number,
        checked: boolean,
    ) => {
        const current = data[key];
        const next = checked
            ? Array.from(new Set([...current, id]))
            : current.filter((value: number) => value !== id);
        setData(key, next);
    };

    const toggleAlphabet = (id: number, checked: boolean) => {
        const next = checked
            ? Array.from(new Set([...data.alphabets, id]))
            : data.alphabets.filter((value: number) => value !== id);
        setData("alphabets", next);
    };

    const normalizedColors = Array.isArray(colorsList)
        ? colorsList
        : ((colorsList as unknown as { data?: Color[] })?.data ?? []);
    const normalizedIndustries = Array.isArray(industriesList)
        ? industriesList
        : ((industriesList as unknown as { data?: Industry[] })?.data ?? []);
    const normalizedTastes = Array.isArray(tastesList)
        ? tastesList
        : ((tastesList as unknown as { data?: Taste[] })?.data ?? []);
    const normalizedAlphabets = Array.isArray(alphabetsList)
        ? alphabetsList
        : ((alphabetsList as unknown as { data?: Alphabets[] })?.data ?? []);

    const handleSelectAllAlphabets = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setData(
                "alphabets",
                normalizedAlphabets.map((alphabet) => alphabet.alphabet_id),
            );
            return;
        }
        setData("alphabets", []);
    };

    const selectedColors = normalizedColors.filter((color) =>
        data.colors.includes(color.id),
    );
    const selectedIndustries = normalizedIndustries.filter((industry) =>
        data.industries.includes(industry.id),
    );
    const selectedTastes = normalizedTastes.filter((taste) =>
        data.tastes.includes(taste.id),
    );
    const selectedAlphabets = normalizedAlphabets.filter((alphabet) =>
        data.alphabets.includes(alphabet.alphabet_id),
    );

    const keywords = ((itemData as unknown as { keywords?: any[] })?.keywords ??
        []) as any[];

    return (
        <AdminLayout>
            <Head title="ロゴ詳細" />
            <div className="flex justify-center px-2 py-2">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-96 max-w-full">
                        {processing && submitTarget === "image" ? (
                            <div className="aspect-h-1 aspect-w-1 w-full animate-pulse bg-gray-200" />
                        ) : (
                            <div className="aspect-h-1 aspect-w-1 w-full">
                                <div className="flex items-center justify-center border">
                                    <ImageWithLoading src={logoSrc} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="max-w-md rounded-xl bg-gray-100 px-4 py-4 text-sm">
                        <p className="font-bold text-teal-600">
                            ロゴID：{itemData?.logo_id ?? "未登録"}
                        </p>
                        <p>
                            <span className="font-semibold">
                                【ロゴタイトル】:{" "}
                            </span>
                            <span>{itemData?.logo_name}</span>
                        </p>
                        <p className="mt-2">
                            <span className="font-semibold">【ロゴ説明】</span>
                            :{" "}
                        </p>
                        <p className="">&emsp;{itemData?.logo_explain}</p>
                        <p className="mt-2">
                            <span className="font-semibold">
                                【カテゴリ ジャンル】
                            </span>
                            :
                            {selectedColors.length === 0
                                ? "未設定"
                                : selectedColors
                                      .map((color) => color.name_ja)
                                      .join(" / ")}
                        </p>
                        <p className="mt-2">
                            <span className="font-semibold">
                                【カテゴリ 業種】
                            </span>
                            :
                            <span>
                                {selectedIndustries.length === 0
                                    ? "未設定"
                                    : selectedIndustries
                                          .map((industry) => industry.name_ja)
                                          .join(" / ")}
                            </span>
                        </p>
                        <p className="mt-2">
                            <span className="font-semibold">
                                【カテゴリ テイスト】
                            </span>
                            :
                            <span>
                                {selectedTastes.length === 0
                                    ? "未設定"
                                    : selectedTastes
                                          .map((taste) => taste.name_ja)
                                          .join(" / ")}
                            </span>
                        </p>
                        <p className="mt-2">
                            <span className="font-semibold">
                                【カテゴリ アルファベット】
                            </span>
                            :
                            <span>
                                {selectedAlphabets.length === 0
                                    ? "未設定"
                                    : selectedAlphabets
                                          .map((alphabet) => alphabet.name)
                                          .join(" / ")}
                            </span>
                        </p>
                    </div>
                    <div className="col-span-2">
                        <TabGroup defaultIndex={initialTabIndex}>
                            <TabList className="flex space-x-1 rounded-xl bg-gray-200 p-1">
                                {categories.map((category) => (
                                    <Tab
                                        key={category.id}
                                        className={({ selected }) =>
                                            classNames(
                                                "w-full rounded-lg py-2.5 text-sm leading-5 font-medium",
                                                "focus:outline-none",
                                                selected
                                                    ? "bg-white text-blue-700 shadow"
                                                    : "text-gray-900 hover:bg-gray-300",
                                            )
                                        }
                                        disabled={!canEdit && category.id !== 1}
                                    >
                                        {category.name}
                                    </Tab>
                                ))}
                            </TabList>
                            <TabPanels className="mt-2">
                                <TabPanel className="rounded border bg-gray-100">
                                    <div className="px-4 py-4">
                                        <LogoBasicsForm
                                            data={data}
                                            setData={setData}
                                            errors={errors}
                                            submitDetail={submitDetail}
                                            processing={processing}
                                            submitTarget={submitTarget}
                                            isCreating={isCreating}
                                            role={role}
                                            designerOptions={designerOptions}
                                        />
                                    </div>
                                </TabPanel>
                                <TabPanel className="rounded border bg-gray-100">
                                    <div className="px-4 py-4">
                                        <LogoImageSlots
                                            canEdit={canEdit}
                                            processing={processing}
                                            submitTarget={submitTarget}
                                            selectedFiles={selectedFiles}
                                            previewUrls={previewUrls}
                                            itemData={itemData}
                                            handleUploadClick={
                                                handleUploadClick
                                            }
                                            handleDeleteFile={handleDeleteFile}
                                            submitImages={submitImages}
                                        />
                                    </div>
                                </TabPanel>
                                <TabPanel className="rounded border bg-gray-100">
                                    <LogoCategoryPicker
                                        data={data}
                                        normalizedColors={normalizedColors}
                                        normalizedAlphabets={
                                            normalizedAlphabets
                                        }
                                        normalizedIndustries={
                                            normalizedIndustries
                                        }
                                        normalizedTastes={normalizedTastes}
                                        toggleCategoryItem={toggleCategoryItem}
                                        toggleAlphabet={toggleAlphabet}
                                        handleSelectAllAlphabets={
                                            handleSelectAllAlphabets
                                        }
                                        saveCategories={saveCategories}
                                        processing={processing}
                                        submitTarget={submitTarget}
                                    />
                                </TabPanel>
                                <TabPanel className="mb-10 rounded border bg-gray-100">
                                    <LogoKeywordPanel keywords={keywords} />
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </div>
                </div>
            </div>
            <LogoCropper
                inputRef={trigger}
                resultImage={handleInputFile}
                aspectRatio={1}
                autoCropArea={1}
                cropWidth={400}
                cropHeight={400}
            />
        </AdminLayout>
    );
}
