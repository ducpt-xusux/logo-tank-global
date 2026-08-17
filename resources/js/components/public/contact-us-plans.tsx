import React from "react";

export const FeatureText = ({
    feature,
    boldClass = "",
    noteSize = "text-[14px]",
}: {
    feature: string;
    boldClass?: string;
    noteSize?: string;
}) => {
    const [mainText, ...noteParts] = feature.split("(");
    const noteText = noteParts.length > 0 ? "(" + noteParts.join("(") : null;
    const [label, ...valueParts] = mainText.split(":");
    const valueText = valueParts.length > 0 ? valueParts.join(":") : null;

    return (
        <>
            {label}
            {valueText && (
                <>
                    :{" "}
                    <span className={`font-bold ${boldClass}`}>
                        {valueText.trim()}
                    </span>
                </>
            )}
            {noteText && (
                <span
                    className={`mt-1 block ${noteSize} leading-tight font-normal opacity-80`}
                >
                    {noteText}
                </span>
            )}
        </>
    );
};

export const PolicySection = ({
    policyKey,
    isFullDesign = false,
    t,
}: {
    policyKey: string;
    isFullDesign?: boolean;
    t: any;
}) => {
    const title = t(`${policyKey}.title`);
    const intro = t(`${policyKey}.intro`);
    const items = t(`${policyKey}.items`, {
        returnObjects: true,
    });
    const cancellationTitle = t(`${policyKey}.cancellation_policy.title`);
    const cancellationItems = t(`${policyKey}.cancellation_policy.items`, {
        returnObjects: true,
    });

    const safeItems = Array.isArray(items) ? items : [];
    const safeCancellationItems = Array.isArray(cancellationItems)
        ? cancellationItems
        : [];

    return (
        <div className="flex flex-col gap-4">
            {!isFullDesign && (
                <>
                    <h4 className="text-[18px] font-bold text-[#474747] md:text-[20px]">
                        {title}
                    </h4>
                    {intro && (
                        <p className="text-[14px] leading-relaxed text-[#555] md:text-[16px]">
                            {intro}
                        </p>
                    )}
                </>
            )}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    {safeItems.map((item: any, index: number) => {
                        const isString = typeof item === "string";
                        const isNote = isString && item.startsWith("(");
                        const isStar = isString && item.startsWith("※");
                        const isHeading =
                            isString &&
                            (isStar ||
                                item === "Chi phí hủy đơn đặt hàng" ||
                                item === "Order cancellation policy:");

                        // Remove the identifier star from text if present to avoid double symbols
                        const cleanItem =
                            isStar && item.startsWith("※ ")
                                ? item.substring(2)
                                : isStar && item.startsWith("※")
                                  ? item.substring(1)
                                  : item;

                        return (
                            <div key={index} className="flex items-start">
                                {isStar ? (
                                    <span className="mr-2 text-[14px] md:text-[16px]">
                                        ※
                                    </span>
                                ) : isNote ? (
                                    <div className="w-2 shrink-0" />
                                ) : (
                                    <span className="mr-2 text-[14px] font-bold md:text-[16px]">
                                        ·
                                    </span>
                                )}
                                <p
                                    className={`text-[14px] leading-relaxed text-[#474747] md:text-[16px] ${isHeading ? "" : ""}`}
                                >
                                    {cleanItem}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {safeCancellationItems.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                        {cancellationTitle && (
                            <h5 className="text-[14px] font-medium text-[#474747] md:text-[16px]">
                                {cancellationTitle}
                            </h5>
                        )}
                        <ul className="flex flex-col gap-1 pl-1">
                            {safeCancellationItems.map((item, index) => (
                                <li
                                    key={index}
                                    className="text-[14px] leading-relaxed text-[#474747] md:text-[16px]"
                                >
                                    <span className="mr-2 text-[14px] font-bold md:text-[16px]">
                                        ·
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};
