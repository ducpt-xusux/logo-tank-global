import { FormEventHandler } from "react";
import { LoaderCircle } from "lucide-react";
import { LogoDetailFormData } from "./types";

interface LogoBasicsFormProps {
    data: LogoDetailFormData;
    setData: (field: keyof LogoDetailFormData, value: any) => void;
    errors: Partial<Record<keyof LogoDetailFormData, string>>;
    processing: boolean;
    submitTarget: "detail" | "categories" | "image" | null;
    isCreating: boolean;
    role: string;
    designerOptions: { id: number; name: string; value: string }[];
    submitDetail: FormEventHandler;
}

export const LogoBasicsForm = ({
    data,
    setData,
    errors,
    processing,
    submitTarget,
    isCreating,
    role,
    designerOptions,
    submitDetail,
}: LogoBasicsFormProps) => {
    return (
        <form onSubmit={submitDetail}>
            <div className="grid grid-cols-4">
                <label
                    htmlFor="logo_name"
                    className="leading-8 font-medium"
                >
                    日本のシンボル名
                </label>
                <div className="col-span-3">
                    <input
                        type="text"
                        className="rounded border bg-white px-2 py-1 focus:outline-none"
                        id="logo_name"
                        value={data.logo_name}
                        onChange={(event) =>
                            setData("logo_name", event.target.value)
                        }
                    />
                    {errors["logo_name"] && (
                        <p className="mt-1 text-red-500">
                            {errors["logo_name"]}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 mt-4">
                <label
                    htmlFor="logo_name_vn"
                    className="leading-8 font-medium"
                >
                    ベトナム語の記号名
                </label>
                <div className="col-span-3">
                    <input
                        type="text"
                        className="rounded border bg-white px-2 py-1 focus:outline-none"
                        id="logo_name_vn"
                        value={data.logo_name_vn ?? ""}
                        onChange={(event) =>
                            setData("logo_name_vn", event.target.value)
                        }
                    />
                    {errors["logo_name_vn"] && (
                        <p className="mt-1 text-red-500">
                            {errors["logo_name_vn"]}
                        </p>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 mt-4">
                <label
                    htmlFor="logo_name_en"
                    className="leading-8 font-medium"
                >
                    英語のシンボル名
                </label>
                <div className="col-span-3">
                    <input
                        type="text"
                        className="rounded border bg-white px-2 py-1 focus:outline-none"
                        id="logo_name_en"
                        value={data.logo_name_en}
                        onChange={(event) =>
                            setData("logo_name_en", event.target.value)
                        }
                    />
                    {errors["logo_name_en"] && (
                        <p className="mt-1 text-red-500">
                            {errors["logo_name_en"]}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-4">
                <label
                    htmlFor="logo_explain"
                    className="leading-8 font-medium"
                >
                    ロゴ説明
                </label>
                <div className="col-span-3">
                    <textarea
                        className="rounded border bg-white px-2 py-1 focus:outline-none"
                        id="logo_explain"
                        rows={5}
                        cols={60}
                        value={data.logo_explain}
                        onChange={(event) =>
                            setData("logo_explain", event.target.value)
                        }
                    />
                    {errors["logo_explain"] && (
                        <p className="mt-1 text-red-500">
                            {errors["logo_explain"]}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-4 grid grid-cols-4">
                <label
                    htmlFor="logo_d_id"
                    className="leading-8 font-medium"
                >
                    デザイナー管理ID
                </label>
                <div className="col-span-3">
                    <input
                        className="rounded border bg-white px-2 py-1 focus:outline-none"
                        id="logo_d_id"
                        type="text"
                        value={data.logo_d_id}
                        onChange={(event) =>
                            setData("logo_d_id", event.target.value)
                        }
                    />
                </div>
            </div>

            {role === "admin" && (
                <div className="mt-4 grid grid-cols-4">
                    <label
                        htmlFor="designer"
                        className="leading-8 font-medium"
                    >
                        デザイナー
                    </label>
                    <div className="col-span-3 w-48">
                        <select
                            id="designer"
                            value={data.reg_by}
                            onChange={(e) =>
                                setData("reg_by", e.target.value)
                            }
                            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-3 text-left shadow-md focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                        >
                            {designerOptions.map((option) => (
                                <option key={option.id} value={option.value}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            <div className="mt-2 flex justify-center">
                <button className="flex h-11 w-52 cursor-pointer justify-center rounded bg-gradient-to-b from-yellow-300 to-orange-400 px-12 py-2.5 font-medium text-white">
                    {processing && submitTarget === "detail" ? (
                        <LoaderCircle className="animate-spin" />
                    ) : isCreating ? (
                        "登録する"
                    ) : (
                        "更新する"
                    )}
                </button>
            </div>
        </form>
    );
};
