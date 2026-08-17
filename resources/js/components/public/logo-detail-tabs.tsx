import * as AccordionPrimitive from "@radix-ui/react-accordion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion";
import { Plus, Minus, Dot } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";

function CustomAccordionTrigger({
    className,
    iconClassName,
    children,
    ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
    iconClassName?: string;
}) {
    return (
        <AccordionPrimitive.Header className="flex w-full">
            <AccordionPrimitive.Trigger
                className={cn(
                    "flex flex-1 cursor-pointer items-center justify-between py-4 font-medium transition-all [&[data-state=closed]_.lucide-minus]:hidden [&[data-state=open]_.lucide-plus]:hidden",
                    className,
                )}
                {...props}
            >
                {children}
                <div className="relative ml-2 size-5 shrink-0">
                    <Plus
                        className={cn(
                            "lucide-plus absolute inset-0 size-5 text-[#474747] transition-transform duration-200",
                            iconClassName,
                        )}
                    />
                    <Minus
                        className={cn(
                            "lucide-minus absolute inset-0 size-5 text-[#474747] transition-transform duration-200",
                            iconClassName,
                        )}
                    />
                </div>
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

interface TabItem {
    id: string;
    label: string;
}

export default function LogoDetailTabs() {
    const { i18n, t } = useTranslation("common", { useSuspense: false });
    const [activeTab, setActiveTab] = useState("order");
    const [openFormats, setOpenFormats] = useState<boolean>(false);
    const [openInfo, setOpenInfo] = useState<boolean>(false);
    const tabs: TabItem[] = [
        { id: "order", label: t("logoDetail.ordering_process") },
        { id: "formats", label: t("logoDetail.file_format_delivery") },
        { id: "faq", label: t("logoDetail.faq") },
    ];

    const steps = t("logoDetail.steps", { returnObjects: true }) as any;
    const fileFormats = t("logoDetail.file_formats", {
        returnObjects: true,
    }) as any;
    const faqs = t("logoDetail.faqs", { returnObjects: true }) as any[];

    return (
        <div className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Tab Headers */}
            <div className="relative mb-10 border-b border-[#B5B5B5]">
                <div className="flex flex-wrap justify-around gap-2 sm:gap-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative -mb-px border-b-2 px-4 py-4 text-sm font-bold tracking-wider whitespace-nowrap transition-all duration-300",
                                activeTab === tab.id
                                    ? "border-brand text-brand"
                                    : "border-transparent text-[#B5B5B5] hover:text-neutral-600",
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="">
                {activeTab === "order" && (
                    <div className="animate-in fade-in mx-auto max-w-[782px] space-y-8 border-b border-[#B5B5B5] py-4 pb-10 duration-500">
                        <div className="space-y-10">
                            {[1, 2, 3, 4, 5].map((num) => (
                                <div key={num} className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <h4 className="text-brand font-bold uppercase">
                                            {
                                                steps[
                                                    `step_${num}` as keyof typeof steps
                                                ]
                                            }
                                        </h4>
                                    </div>
                                    <ul className="ml-7 list-disc space-y-2 text-sm text-neutral-600">
                                        {(
                                            steps[
                                                `step_${num}_detail` as keyof typeof steps
                                            ] as string[]
                                        )?.map((detail, idx) => (
                                            <li key={idx} className="pl-1">
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div className="">
                                <h4 className="text-brand mb-6 font-bold uppercase">
                                    {steps.note_title}
                                </h4>
                                <ul className="ml-7 list-disc space-y-3 text-sm text-neutral-600">
                                    {(steps.notes as string[])?.map(
                                        (note, idx) => (
                                            <li key={idx} className="pl-1">
                                                {note}
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "formats" && (
                    <div className="animate-in fade-in space-y-10 py-4 duration-500">
                        <div className="">
                            <div
                                className={cn(
                                    "bg-brand flex cursor-pointer flex-row justify-between px-4 py-4 transition-all",
                                    openFormats ? "rounded-t-lg" : "rounded-lg",
                                )}
                                onClick={() => setOpenFormats(!openFormats)}
                            >
                                <h3 className="text-[16px] font-bold text-white uppercase">
                                    {fileFormats.title}
                                </h3>
                                {openFormats ? (
                                    <Minus className="text-white" />
                                ) : (
                                    <Plus className="text-white" />
                                )}
                            </div>

                            {openFormats && (
                                <div className="animate-in fade-in slide-in-from-top-2 overflow-hidden rounded-b-lg border border-t-0 border-neutral-200 p-6 duration-300">
                                    <div className="space-y-6">
                                        <p className="max-w-4xl leading-relaxed text-neutral-600">
                                            {fileFormats.description}
                                        </p>
                                        <div className="max-w-[360px] overflow-hidden rounded-xl border">
                                            <Table>
                                                <TableHeader className="bg-[#FA8232]">
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className="font-bold text-white">
                                                            {
                                                                fileFormats
                                                                    .table
                                                                    .format
                                                            }
                                                        </TableHead>
                                                        <TableHead className="font-bold text-white">
                                                            {
                                                                fileFormats
                                                                    .table.type
                                                            }
                                                        </TableHead>
                                                        <TableHead className="font-bold text-white">
                                                            {
                                                                fileFormats
                                                                    .table
                                                                    .extension
                                                            }
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {(
                                                        fileFormats.table
                                                            .rows as any[]
                                                    ).map((row, idx) => (
                                                        <TableRow
                                                            key={idx}
                                                            className="hover:bg-neutral-50/50"
                                                        >
                                                            <TableCell className="font-medium">
                                                                {row.title}
                                                            </TableCell>
                                                            <TableCell>
                                                                {row.type}
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="bg-brand/10 text-brand rounded px-2 py-1 font-mono text-xs font-bold">
                                                                    .
                                                                    {
                                                                        row.extension
                                                                    }
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="">
                            <div
                                className={cn(
                                    "bg-brand flex cursor-pointer flex-row justify-between px-4 py-4 transition-all",
                                    openInfo ? "rounded-t-lg" : "rounded-lg",
                                )}
                                onClick={() => setOpenInfo(!openInfo)}
                            >
                                <h4 className="text-[16px] font-bold text-white uppercase">
                                    {fileFormats.info_title}
                                </h4>
                                {openInfo ? (
                                    <Minus className="text-white" />
                                ) : (
                                    <Plus className="text-white" />
                                )}
                            </div>

                            {openInfo && (
                                <div className="animate-in fade-in slide-in-from-top-2 space-y-10 overflow-hidden rounded-b-lg border border-t-0 border-neutral-200 p-6 duration-300">
                                    <div className="space-y-5 lg:pl-4">
                                        <ul className="list-none space-y-2 text-sm text-[#474747]">
                                            {(
                                                fileFormats.info_description as string[]
                                            ).map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                        <span className="text-sm text-[#474747]">
                                            {t(
                                                "logoDetail.file_formats.depend_logo_design",
                                            )}
                                        </span>
                                    </div>
                                    <div className="">
                                        <img
                                            src={
                                                i18n.language === "vi"
                                                    ? "/img/logo_guide_vn.png"
                                                    : i18n.language === "ja"
                                                      ? "/img/logo_guide_ja.png"
                                                      : "/img/logo_guide.png"
                                            }
                                            alt=""
                                            className="mx-auto"
                                        />
                                    </div>
                                    <div className="">
                                        <h5 className="mb-4 text-[16px] font-semibold text-[#FA8232]">
                                            {t(
                                                "logoDetail.file_formats.delivered_images_title",
                                            )}
                                        </h5>

                                        {/* Row 1: 2/3 and 1/3 split on desktop */}
                                        <div className="max-w-[857px] lg:pl-8">
                                            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
                                                <div className="flex flex-col space-y-4 md:col-span-2">
                                                    <div className="flex items-center gap-2">
                                                        <Dot className="size-6 shrink-0" />
                                                        <span className="text-[16px] font-medium text-[#474747]">
                                                            {
                                                                fileFormats
                                                                    .delivered_items?.[0]
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex aspect-[9/4] w-full items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-[#fff] p-8">
                                                        <img
                                                            src="/img/logo_tank_full.png"
                                                            className="max-h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <Dot className="size-6 shrink-0" />
                                                        <span className="text-[16px] font-medium text-[#474747]">
                                                            {
                                                                fileFormats
                                                                    .delivered_items?.[1]
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex aspect-[9/8] w-full items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-[#fff] p-8 md:aspect-auto md:flex-1">
                                                        <img
                                                            src="/img/logo.svg"
                                                            className="size-24 object-contain"
                                                            
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2: 1/2 and 1/2 split on desktop */}
                                            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                                                <div className="flex flex-col space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <Dot className="size-6 shrink-0" />
                                                        <span className="text-[16px] font-medium text-[#474747]">
                                                            {
                                                                fileFormats
                                                                    .delivered_items?.[2]
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex aspect-2/1 w-full items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-[#fff] p-8">
                                                        <img
                                                            src="/img/logo_tank.png"
                                                            className="max-h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <Dot className="size-6 shrink-0" />
                                                        <span className="text-[16px] font-medium text-[#474747]">
                                                            {
                                                                fileFormats
                                                                    .delivered_items?.[3]
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex aspect-2/1 w-full items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-white p-8">
                                                        <img
                                                            src="/img/design_service.png"
                                                            className="max-h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "faq" && (
                    <div className="animate-in fade-in py-4 duration-500">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-4"
                        >
                            {faqs.map((faq: any, index: number) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border-none"
                                >
                                    <CustomAccordionTrigger
                                        className="text-brand rounded-lg border border-neutral-100 bg-neutral-50 px-6 py-4 text-left font-bold uppercase transition-all hover:no-underline data-[state=open]:rounded-b-none"
                                        iconClassName="text-[#474747]"
                                    >
                                        {faq.question}
                                    </CustomAccordionTrigger>
                                    <AccordionContent className="animate-in fade-in slide-in-from-top-2 rounded-b-lg border border-t-0 border-neutral-100 bg-white p-6 leading-relaxed whitespace-pre-wrap text-neutral-600 duration-300">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </div>
        </div>
    );
}
