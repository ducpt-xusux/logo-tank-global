import React, { useEffect, useRef, useState } from "react";
import { Field } from "@/types";
import {
    Button,
    Calendar,
    Input,
    InputError,
    Label,
    notify,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components";
import {
    ChevronDownIcon,
    EyeIcon,
    EyeOffIcon,
    File as FileIcon,
    Upload as UploadIcon,
    X,
} from "lucide-react";
import { ja } from "react-day-picker/locale";
import { Editor } from "@tinymce/tinymce-react";
import { postService } from "@/services";

interface FormFieldProps {
    field: Field;
    data: any;
    setData: (data: any, value: any) => void;
    errors: any;
}

export const FormField = React.memo(
    (props: FormFieldProps) => {
        if (props.field.type === "select")
            return <FormFieldSelect {...props} />;
        if (props.field.type === "password")
            return <FormFieldPassword {...props} />;
        if (props.field.type === "date") return <FormFieldDate {...props} />;
        if (props.field.type === "editor")
            return <FormFieldEditor {...props} />;
        if (props.field.type === "number")
            return <FormFieldNumber {...props} />;
        if (props.field.type === "file") return <FormFieldFile {...props} />;
        return <FormFieldText {...props} />;
    },
    (prevProps, nextProps) => {
        return (
            prevProps.data[prevProps.field.name] ===
                nextProps.data[nextProps.field.name] &&
            prevProps.errors[prevProps.field.name] ===
                nextProps.errors[nextProps.field.name]
        );
    },
);

function FormFieldSelect({ field, data, setData, errors }: FormFieldProps) {
    useEffect(() => {
        if (!data[field.name]) {
            setData(field.name, field.options?.[0].value);
        }
    }, []);

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Select
                defaultValue={
                    data[field.name]
                        ? `${data[field.name]}`
                        : field.options?.[0].value
                }
                onValueChange={(e) => setData(field.name, e)}
            >
                <SelectTrigger
                    id={field.name}
                    className="w-full truncate"
                    aria-label={field.name}
                >
                    <SelectValue
                        placeholder={field.placeholder ?? field.label}
                    />
                </SelectTrigger>
                <SelectContent>
                    {field.options?.map((option) => (
                        <SelectItem value={option.value} key={option.id}>
                            {option.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <InputError message={errors[field.name]} />
        </div>
    );
}

export function FormFieldText({
    field,
    data,
    setData,
    errors,
}: FormFieldProps) {
    const value = data?.[field.name] ?? "";
    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>

            <Input
                id={field.name}
                className="mt-1 block w-full"
                defaultValue={value}
                onChange={(e) => setData(field.name, e.target.value)}
                placeholder={field.placeholder ?? field.label}
            />

            <InputError message={errors?.[field.name]} />
        </div>
    );
}

export function FormFieldPassword({
    field,
    data,
    setData,
    errors,
}: FormFieldProps) {
    const [passwordType, setPasswordType] = useState("password");
    const value = data?.[field.name] ?? "";

    const changePasswordType = () => {
        setPasswordType(passwordType === "password" ? "text" : "password");
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>

            <div className="relative">
                <Input
                    id={field.name}
                    className="mt-1 block w-full"
                    defaultValue={value}
                    type={passwordType}
                    onChange={(e) => setData(field.name, e.target.value)}
                    placeholder={field.placeholder ?? field.label}
                />
                <span
                    className="absolute right-2 top-2 cursor-pointer p-1"
                    onClick={changePasswordType}
                >
                    {passwordType === "password" ? (
                        <EyeOffIcon className="size-5" />
                    ) : (
                        <EyeIcon className="size-5" />
                    )}
                </span>
            </div>

            <InputError message={errors?.[field.name]} />
        </div>
    );
}

export function FormFieldDate({
    field,
    data,
    setData,
    errors,
}: FormFieldProps) {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(
        data?.[field.name] ? new Date(data[field.name]) : undefined,
    );

    function onSelect(date: Date | undefined) {
        setDate(date);
        setOpen(false);
        let data = null;

        if (date) {
            const year = date.getFullYear();
            const month = pad(date.getMonth() + 1); // Tháng bắt đầu từ 0
            const day = pad(date.getDate());

            data = `${year}-${month}-${day}`;
        }
        setData(field.name, data);
    }

    const pad = (n: number) => n.toString().padStart(2, "0");

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                    >
                        {date ? date.toLocaleDateString("ja-JP") : "日付を選択"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        locale={ja}
                        onSelect={onSelect}
                    />
                </PopoverContent>
            </Popover>
            <InputError message={errors?.[field.name]} />
        </div>
    );
}

export function FormFieldEditor({
    field,
    data,
    setData,
    errors,
}: FormFieldProps) {
    const editorRef = useRef(null);

    function handleEditorChange(content: string, editor: any) {
        setData(field.name, content);
        setData(`${field.name}_text`, editor.getContent({ format: "text" }));
    }

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Editor
                tinymceScriptSrc="/assets/tinymce/tinymce.min.js"
                licenseKey="gpl"
                onInit={(_evt, editor) => (editorRef.current = editor)}
                value={data?.[field.name] ?? ""}
                id={field.name}
                onEditorChange={handleEditorChange}
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "preview",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks fontsize | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | table link anchor image | " +
                        "print preview media fullscreen | forecolor backcolor emoticons | " +
                        "removeformat | help",
                    content_style:
                        'body { font-family:"Noto Sans JP", sans-serif; font-size:16px }',
                    language: "ja",
                    font_size_formats:
                        "8px 10px 12px 14px 16px 18px 24px 36px 48px",
                    images_upload_handler: async (image: any) => {
                        return new Promise((resolve, reject) => {
                            postService
                                .uploadImage({ picture: image })
                                .then((data) => {
                                    const { link } = data;
                                    resolve(link);
                                })
                                .catch((e: any) => {
                                    notify.error("Error");
                                    reject(e);
                                });
                        });
                    },
                }}
            />
            <InputError message={errors?.[field.name]} />
        </div>
    );
}

export function FormFieldNumber({
    field,
    data,
    setData,
    errors,
}: FormFieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>

            <Input
                id={field.name}
                className="mt-1 block w-52"
                value={data?.[field.name] ?? ""}
                type="number"
                onChange={(e) => setData(field.name, e.target.value)}
                placeholder={field.placeholder ?? field.label}
            />

            <InputError message={errors?.[field.name]} />
        </div>
    );
}

export function FormFieldFile({
    field,
    data,
    setData,
    errors,
}: FormFieldProps) {
    const [fileName, setFileName] = useState<string>("");
    const [preview, setPreview] = useState<string | null>(
        data?.[field.name] || null,
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFileName(file.name);
            setData(field.name, file); // Lưu luôn vào form data
        }
    };

    const handleRemoveFile = () => {
        setFileName("");
        setPreview(null);
        setData(field.name, null);

        const input = document.getElementById(field.name) as HTMLInputElement;
        if (input) input.value = "";
    };

    return (
        <div className="grid gap-2">
            <Label htmlFor={field.name}>{field.label}</Label>

            <div className="relative">
                <Input
                    id={field.name}
                    className="mt-1 block w-full"
                    type="file"
                    onChange={handleFileChange}
                    disabled={field.disabled}
                    accept={field.accept}
                />

                {!fileName && !preview && (
                    <span className="absolute right-2 top-2 pointer-events-none">
                        <UploadIcon className="size-5 text-gray-400" />
                    </span>
                )}
            </div>

            {(fileName || preview) && (
                <div className="mt-2 flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-16 w-16 rounded object-cover"
                        />
                    ) : (   
                        <FileIcon className="size-8 text-gray-400" />
                    )}

                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                            {fileName}
                        </p>
                        {typeof File !== "undefined" &&
                            data?.[field.name] instanceof File && (
                                <p className="text-xs text-gray-500">
                                    {(data[field.name].size / 1024).toFixed(2)}{" "}
                                    KB
                                </p>
                            )}
                    </div>

                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="rounded p-1 hover:bg-gray-200"
                    >
                        <X className="size-5 text-gray-600" />
                    </button>
                </div>
            )}

            {field.explain && (
                <p className="text-xs text-gray-500">{field.explain}</p>
            )}

            <InputError message={errors?.[field.name]} />
        </div>
    );
}
