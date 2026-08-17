import { AppLayout, Container } from "@/components";
import { Check, Dot, Phone } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { currencyNumber, getLocaleLink } from "@/helper/utils";
import { Head, Link, usePage } from "@inertiajs/react";
import { SharedData } from "@/types";
import {
  FeatureText,
  PolicySection,
  ContactUsDialog,
} from "@/components/public";
import { useState } from "react";

interface Pricing {
  vi: number;
  en: number;
  ja: number;
}

interface ServicePackage {
  key: string;
  prices: Pricing;
}

interface ContactUsPageProps extends SharedData {
  packages: Record<string, ServicePackage[]>;
}

export default function ContactUs() {
  const { i18n, t } = useTranslation("common", { useSuspense: false });
  const { packages } = usePage<ContactUsPageProps>().props;
  const locale = i18n.language as "vi" | "en" | "ja";
  const [openContactUsDialog, setOpenContactUsDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const breadcrumbs = [
    {
      title: t("breadcrumbs.home"),
      href: getLocaleLink("/"),
    },
    {
      title: t("headers.contact_us"),
    },
  ];

  const getPackagePrice = (
    category: string,
    key: string,
  ): number | undefined => {
    const pkg = packages?.[category]?.find((p: any) => p.key === key);
    return pkg?.prices?.[locale];
  };

  const modificationPlans = [
    {
      key: "plan_1",
      topBarClass: "bg-[#FED03C]",
      hasBadge: true,
      hasNote: false,
      metaKeys: ["time", "free_revision"],
    },
    {
      key: "plan_2",
      topBarClass: "bg-[#F9A648]",
      hasBadge: false,
      hasNote: true,
      metaKeys: ["quantity", "time", "free_revision"],
    },
    {
      key: "plan_3",
      topBarClass: "bg-[#F58E4C]",
      hasBadge: false,
      hasNote: true,
      metaKeys: ["quantity", "time", "free_revision"],
    },
  ];

  const fullDesignPlans = [
    {
      key: "plan_1",
      bgClass: "bg-[#32A9DA]",
      hasBadge: true,
      hasNote: false,
      price: getPackagePrice("full_design", "plan_1"),
    },
    {
      key: "plan_2",
      bgClass: "bg-[#8868AE]",
      hasBadge: true,
      hasNote: false,
      price: getPackagePrice("full_design", "plan_2"),
    },
    {
      key: "plan_3",
      bgClass: "bg-[#A31746]",
      hasBadge: true,
      hasNote: false,
      price: getPackagePrice("full_design", "plan_3"),
    },
  ];

  const selectionItems = [
    {
      key: "item_1",
      bgClass: "bg-[#B8D87A]",
      price: getPackagePrice("selection", "item_1"),
    },
    {
      key: "item_2",
      bgClass: "bg-[#76BE43]",
      price: getPackagePrice("selection", "item_2"),
    },
    {
      key: "item_3",
      bgClass: "bg-[#62A945]",
      price: getPackagePrice("selection", "item_3"),
    },
  ];

  return (
    <>
            <Head title="Contact Us" />
      <AppLayout>
        <ContactUsDialog
          open={openContactUsDialog}
          setOpenContactUs={setOpenContactUsDialog}
          selectedPlan={selectedPlan}
        />
        <div className="flex w-full items-center bg-[#F2F4F5] text-[12px] text-[#5F6C72] md:h-[72px] md:text-[16px]">
          <div className="mx-auto w-full max-w-[1238px] px-4">
            <div className="flex items-center gap-2">
              {breadcrumbs.map((breadcrumb, index) => (
                <div
                  key={`${breadcrumb.title}-${index}`}
                  className="flex items-center gap-2"
                >
                  {index > 0 && <span>{">"}</span>}
                  {breadcrumb.href ? (
                    <Link
                      href={breadcrumb.href}
                      className="hover:text-brand transition-colors"
                    >
                      {breadcrumb.title}
                    </Link>
                  ) : (
                    <span className="text-brand font-medium">
                      {breadcrumb.title}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-[1920px] max-w-full overflow-hidden">
          {/* Background Banner */}
          <img
            src="/img/explore-banner.png"
            alt="Explore Banner"
            className="w-full object-cover md:h-[520px]"
          />
          {/* Content Overlay */}
          <div className="absolute inset-0">
            <Container className="relative flex h-full items-center">
              {/* Left Text Block Box */}
              <div className="flex w-full max-w-[731px] flex-col items-start justify-center gap-[30px] pt-[20px] pl-0 md:pt-0">
                {/* Title */}
                <h1 className="text-[32px] leading-20 font-bold tracking-[0.5px] text-[#474747] md:text-[40px]">
                  <Trans
                    t={t}
                    i18nKey="explore.heading_1"
                    components={{
                      ambassador: (
                        <span className="relative z-10 mx-[-4px] inline-flex items-center justify-center bg-[url('/img/highlight-bg.svg')] bg-size-[100%_100%] bg-center bg-no-repeat px-[20px] py-[6px] font-bold text-white uppercase"></span>
                      ),
                      brand: (
                        <span className="text-brand font-bold uppercase" />
                      ),
                    }}
                  />
                </h1>

                {/* Description */}
                <p className="max-w-[650px] text-[15px] leading-[1.8] font-normal tracking-wide text-[#555]">
                  {t("explore.description")}
                </p>

                {/* Contact Button */}
                <button className="mt-[10px] flex h-[54px] items-center justify-center gap-2 rounded-[8px] bg-[#F3993F] px-[32px] text-[18px] font-bold tracking-wider text-white shadow-md transition-all hover:bg-[#e08b35] hover:shadow-lg">
                  <Phone className="h-[22px] w-[22px] stroke-[2.5]" />
                  +84-37-443-1461
                </button>
              </div>

              <div className="absolute right-0 bottom-0 w-[240px] md:w-[320px] lg:w-full lg:max-w-[420px]">
                <div className="absolute top-0 left-0 z-20 w-[154px] rounded-l-[12px] rounded-tr-[12px] bg-[#F3993F] p-3 shadow-lg md:left-5 md:w-[220px] md:rounded-l-[16px] md:rounded-tr-[16px] md:p-5 lg:-left-[160px] lg:w-[200px]">
                  <p className="text-[12px] leading-snug font-bold text-white md:text-[15px] lg:text-[16px]">
                    {t("explore.orange_box")}
                    <img
                      src="/img/ok-finger.svg"
                      alt=""
                      className="ml-1 inline-block h-6 w-6"
                    />
                  </p>
                </div>

                <img
                  src="/img/the-girl.png"
                  alt=""
                  className="relative z-10 ml-5 h-auto w-full"
                />
                {/* White Bubble (Right) */}
                <div className="absolute -top-[35px] -right-[10px] z-20 w-[180px] rounded-[16px] bg-white p-3 shadow-lg md:-right-[20px] md:w-[240px] md:rounded-tl-[16px] md:rounded-r-[16px] md:p-5 lg:-right-[180px] lg:w-[215px] lg:rounded-[16px]">
                  <p className="text-[12px] leading-snug font-bold text-[#F3993F] md:text-[15px] lg:text-[16px]">
                    {t("explore.white_box")}
                    <span className="text-[14px] md:text-[20px]">😊</span>
                  </p>
                </div>
              </div>
            </Container>
          </div>
        </div>

        {/* Modification */}
        <div className="bg-white pt-10 md:pt-16">
          <div className="flex flex-col gap-y-2 md:mt-4">
            <h2 className="text-brand mx-auto px-4 text-center text-[24px] font-bold uppercase md:text-[30px]">
              {t("contact_us.modification.title")}
            </h2>
            <span className="mx-auto max-w-[980px] px-4 text-center text-[13px] leading-[1.6] text-[#666] md:text-[18px]">
              {t("contact_us.modification.subtitle")}
            </span>
          </div>

          <Container className="w-full px-8 py-16">
            <div className="grid grid-cols-1 items-start gap-6 px-4 md:grid-cols-3 md:px-0">
              {modificationPlans.map((plan) => (
                <div
                  key={plan.key}
                  className="relative flex flex-col overflow-visible rounded-xl bg-white shadow-[0_14px_30px_rgba(0,0,0,0.1)]"
                >
                  {plan.hasBadge && (
                    <div className="absolute -top-10 left-6 z-20 flex h-[78px] w-[78px] items-center justify-center rounded-full bg-[#E12A00] text-center text-[17px] leading-[1.15] font-bold text-white">
                      {t(`contact_us.modification.plans.${plan.key}.badge`)}
                    </div>
                  )}

                  <div
                    className={`h-[22px] w-full rounded-t-xl ${plan.topBarClass}`}
                  ></div>

                  <div className="px-6 pb-5">
                    <h4 className="mt-5 text-left text-[20px] leading-[1.35] font-bold text-[#38485A] uppercase">
                      <Trans
                        t={t}
                        i18nKey={`contact_us.modification.plans.${plan.key}.title`}
                        components={{
                          br: <br />,
                        }}
                      />
                    </h4>

                    <p className="mt-3 text-[15px] leading-[1.55] text-[#8F8F8F]">
                      {t(`contact_us.modification.plans.${plan.key}.desc`)}
                    </p>

                    <p className="mt-4 text-[24px] leading-[1.2] font-extrabold text-[#1D2F46]">
                      {(() => {
                        const price = getPackagePrice("modification", plan.key);
                        return price ? currencyNumber(price, true) : null;
                      })()}
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                      {(
                        (t(
                          `contact_us.modification.plans.${plan.key}.features`,
                          { returnObjects: true },
                        ) as string[]) || []
                      ).map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="mt-[3px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#F7941D] text-white">
                            <Check className="h-3 w-3 stroke-3" />
                          </span>
                          <p className="text-[16px] leading-[1.55] text-[#555]">
                            <FeatureText
                              feature={feature}
                              boldClass="text-[#333]"
                              noteSize="text-[13px]"
                            />
                          </p>
                        </div>
                      ))}

                      {plan.hasNote && (
                        <div className="mt-2">
                          <p className="text-[15px] leading-[1.6] text-[#8C8C8C] italic">
                            {t(
                              `contact_us.modification.plans.${plan.key}.note`,
                            )}
                          </p>
                          <div className="mt-4 border-t border-[#EDEDED]" />
                        </div>
                      )}
                      <div className="mt-3 flex flex-col gap-3">
                        {plan.metaKeys.map((metaKey) => (
                          <div key={metaKey} className="flex items-start gap-3">
                            <span className="mt-[3px] inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#F7941D] text-white">
                              <Check className="h-3 w-3 stroke-white" />
                            </span>
                            <p className="text-[16px] leading-[1.55] text-[#555]">
                              {t(`contact_us.${metaKey}_label`)}{" "}
                              <span className="font-bold text-[#333]">
                                {t(
                                  `contact_us.modification.plans.${plan.key}.${metaKey}`,
                                )}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button className="mt-6 h-[52px] w-full rounded-[8px] bg-[#FF8D26] text-[16px] font-bold tracking-[0.4px] text-white transition-colors hover:bg-[#e28518]">
                      {t("contact_us.buy_now")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border-2 border-dotted px-10 py-7 md:mt-10 md:px-15">
              <PolicySection policyKey="contact_us.modification_policy" t={t} />
            </div>
          </Container>
        </div>

        {/* sub banner */}

        <div className="relative w-full">
          <img
            src="/img/contact_us_sub_banner.png"
            alt="Sub Banner"
            className="h-auto w-full"
          />
          <div className="absolute right-[11.5%] bottom-0 z-20 w-[35%] md:w-[23%]">
            <img src="/img/twins.png" alt="Twins" className="h-auto w-full" />
          </div>
        </div>

        {/* Full-design */}
        <div className="bg-white py-10 pt-16">
          <div className="mb-12 flex flex-col gap-4 px-2 text-center md:gap-y-3">
            <h2 className="text-brand mx-auto px-4 text-center text-[24px] font-bold uppercase md:text-[30px]">
              {t("contact_us.full_design.title")}
            </h2>
            <span className="mx-auto px-4 text-center text-[13px] leading-[1.6] text-[#666] md:text-[20px]">
              {t("contact_us.full_design.subtitle")}
            </span>
          </div>

          <Container className="mt-6 flex w-full flex-col gap-y-10 px-8 md:mt-10">
            <div className="grid grid-cols-1 items-stretch gap-6 px-4 md:grid-cols-3 md:px-0">
              {fullDesignPlans.map((plan) => (
                <div
                  key={plan.key}
                  className={`relative flex flex-col overflow-visible rounded-[20px] ${plan.bgClass} p-8 text-white shadow-[0_14px_30px_rgba(0,0,0,0.1)]`}
                >
                  {plan.hasBadge && (
                    <div className="absolute top-0 right-0 z-20 flex h-[40px] items-center justify-center rounded-tr-[20px] rounded-bl-[20px] bg-white px-6 text-center text-[15px] font-bold text-[#34ACE0]">
                      <span
                        className={
                          plan.key === "plan_1"
                            ? "text-[#29ABE2]"
                            : plan.key === "plan_2"
                              ? "text-[#8868AE]"
                              : "text-[#A31F37]"
                        }
                      >
                        {t(`contact_us.full_design.plans.${plan.key}.badge`)}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col items-center">
                    <h4 className="mt-8 h-[60px] text-left text-[20px] leading-[1.35] font-bold uppercase">
                      <Trans
                        t={t}
                        i18nKey={`contact_us.full_design.plans.${plan.key}.title`}
                        components={{
                          br: <br />,
                        }}
                      />
                    </h4>

                    <div className="mt-4 h-px w-full bg-white opacity-40"></div>

                    <p className="mt-6 min-h-[50px] text-center text-[15px] leading-[1.55] opacity-90">
                      {t(`contact_us.full_design.plans.${plan.key}.desc`)}
                    </p>

                    <div className="mt-8 flex flex-col items-center gap-1">
                      <span className="text-[24px] font-bold tracking-wider uppercase">
                        {t(`contact_us.full_design.plans.${plan.key}.type`)}
                      </span>
                      <p className="text-[34px] leading-[1.2] font-extrabold md:text-[39px]">
                        {plan.price ? currencyNumber(plan.price, true) : null}
                      </p>
                    </div>

                    <div className="mt-10 flex w-full flex-col gap-5">
                      {(
                        t(`contact_us.full_design.plans.${plan.key}.features`, {
                          returnObjects: true,
                        }) as string[]
                      ).map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <span className="mt-[4px] inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-white text-white">
                            <Check className="h-3 w-3 stroke-[#333]" />
                          </span>
                          <p className="text-[17px] leading-[1.4] font-medium">
                            <FeatureText
                              feature={feature}
                              noteSize="text-[14px]"
                            />
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPlan(plan.key);
                      setOpenContactUsDialog(true);
                    }}
                    className="mt-12 h-[42px] w-full max-w-[311px] rounded-[8px] bg-[#FF8D26] text-[16px] font-bold tracking-[0.6px] text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-[#e28518]"
                  >
                    {t("contact_us.buy_now")}
                  </button>
                </div>
              ))}
            </div>
            <p className="w-full px-4 text-[16px] text-[#252525] md:px-0">
              {t("contact_us.pricing_note")}
            </p>
            <div className="rounded-2xl border border-dotted border-amber-950 p-5 md:p-10">
              <PolicySection
                policyKey="contact_us.full_design_policy"
                isFullDesign
                t={t}
              />
            </div>
          </Container>
        </div>

        {/* sub-banner 2 */}
        <div className="relative w-full max-w-[1920px] bg-[#282568] md:mt-48">
          <Container className="grid w-full grid-cols-1 gap-y-3 text-white md:grid-cols-3 md:px-17">
            <div className="flex flex-col gap-5 py-7 md:col-span-2">
              <h4 className="leading-12 font-semibold md:text-[36px]">
                <Trans
                  t={t}
                  i18nKey="contact_us.sub_banner_2.title"
                  components={{
                    highlight: (
                      <span className="relative z-10 mx-[-4px] inline-flex items-center justify-center bg-[url('/img/highlight-red.svg')] bg-size-[100%_100%] bg-center bg-no-repeat px-[20px] py-[6px] font-bold text-white"></span>
                    ),
                    br: <br />,
                  }}
                />
              </h4>
              <p className="md:text-[18px]">
                {t("contact_us.sub_banner_2.desc")}
              </p>
              <div className="flex h-[56px] max-w-[256px] flex-row items-center justify-center gap-4 rounded-[11px] bg-white">
                <Phone className="text-brand h-5 w-5 fill-current" />
                <span className="text-brand text-[20px] font-black">
                  {t("contact_us.sub_banner_2.phone")}
                </span>
              </div>
            </div>
            <div className="relative z-10 flex justify-center md:items-end md:justify-start">
              <img
                src="/img/girl_sub-banner2.png"
                alt="girl_sub-banner2"
                className="relative -mt-14 h-auto w-[220px] md:-mt-20 md:w-[280px] lg:-mt-24 lg:w-[368px]"
              />
            </div>
          </Container>
        </div>

        {/* Selection */}
        <Container className="my-10 flex flex-col gap-y-12 px-12">
          <div className="mx-auto flex w-full max-w-[995px] flex-col gap-4 px-2 text-center md:gap-y-3">
            <h2 className="px-4 text-center text-[24px] font-bold text-[#62A945] uppercase md:text-[30px]">
              {t("contact_us.selection.title")}
            </h2>
            <span className="px-4 text-center text-[13px] leading-[32px] text-[#666] md:text-[20px]">
              {t("contact_us.selection.subtitle")}
            </span>
          </div>

          <div className="mx-auto flex w-full max-w-[1240px] flex-col items-stretch gap-3 md:flex-row md:gap-4">
            {selectionItems.map((plan) => (
              <div
                key={plan.key}
                className={`flex w-full flex-col rounded-[8px] p-6 text-[#474747] shadow-md md:w-1/3 md:p-8 ${plan.bgClass}`}
              >
                <h4 className="mb-4 min-h-[55px] text-left text-[20px] leading-[1.4] font-extrabold text-[#474747] uppercase">
                  <Trans
                    t={t}
                    i18nKey={`contact_us.selection.items.${plan.key}.title`}
                    components={{ br: <br /> }}
                  />
                </h4>

                <div className="mt-2 flex min-h-[50px] flex-col items-center justify-center border-t border-[#474747]/20 pt-4">
                  {plan.key === "item_1" && (
                    <p className="text-center text-[15px] font-medium text-[#474747]">
                      {t(`contact_us.selection.items.${plan.key}.type`)}
                    </p>
                  )}
                  <p className="text-center text-[15px] font-medium text-[#474747]">
                    {t(`contact_us.selection.items.${plan.key}.desc`)}
                  </p>
                </div>

                <p className="my-6 text-center text-[32px] font-bold tracking-tight text-[#474747] md:text-[36px]">
                  {plan.price ? currencyNumber(plan.price, true) : null}
                </p>

                <p className="mb-8 min-h-[70px] text-left text-[15px] leading-relaxed text-[#474747]">
                  <Trans
                    t={t}
                    i18nKey={`contact_us.selection.items.${plan.key}.info`}
                    components={{ br: <br /> }}
                  />
                </p>

                <div className="flex flex-col gap-5">
                  {(
                    (t(`contact_us.selection.items.${plan.key}.features`, {
                      returnObjects: true,
                    }) as string[]) || []
                  ).map((feature, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <span className="mt-[4px] inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#474747] text-white">
                        <Check className="h-[12px] w-[12px] stroke-3" />
                      </span>
                      <p className="text-[14px] leading-[1.6] font-medium text-[#474747]">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <p className="leading-[29px] font-medium md:text-[16px]">
              {t("contact_us.selection.note.note_1")}
            </p>
            <p className="leading-[29px] font-medium md:text-[16px]">
              {t("contact_us.selection.note.note_2")}
            </p>
            <p className="leading-[29px] font-medium md:text-[16px]">
              {t("contact_us.selection.note.note_3")}
            </p>
          </div>
        </Container>
      </AppLayout>
    </>
  );
}
