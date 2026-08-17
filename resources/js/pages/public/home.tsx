import { SharedData, Logo, Industry, Color, Taste } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import { useTranslation, Trans } from "react-i18next";
import {
    AppLayout,
    HeroBanner,
    PublicLogo,
    CtaSection,
    Container,
} from "@/components/public";
import { Button } from "@/components/ui/button";
import { getLocaleLink } from "@/helper/utils";
export default function HomePage() {
    const { auth, newestLogos, industries, colors, tastes } = usePage<
        SharedData & {
            newestLogos?: Logo[];
            industries?: { data: Industry[] };
            colors?: { data: Color[] };
            tastes?: { data: Taste[] };
        }
    >().props;
    const { t } = useTranslation("common", { useSuspense: false });
    return (
        <AppLayout
            className="bg-[#F5F5F5]"
            footerClassName="bg-[#F5F5F5] pt-56"
        >
            <Head title={t("title_tag.home")} />
            <HeroBanner
                industries={industries?.data}
                colors={colors?.data}
                tastes={tastes?.data}
            />
            <Container className="mb-20 px-4 md:px-0">
                <div className="mb-10 flex w-full items-start justify-start">
                    <span className="flex h-[43px] flex-row items-center rounded-[38px] bg-[#FF8D26] px-8 text-base font-bold text-white">
                        {t("home.newestLogo")}
                    </span>
                </div>
                <PublicLogo initialLogos={newestLogos} />
            </Container>
            <Container className="mt-5 mb-20">
                <div className="w-full text-center">
                    <Button className="h-[40px] cursor-pointer rounded-[4px] bg-[#474747] px-8 text-base text-white hover:bg-[#5b5858]">
                        <Link href={getLocaleLink("/explore")}>
                            {t("home.loadMore")}
                        </Link>
                    </Button>
                </div>
            </Container>
            <CtaSection />
        </AppLayout>
    );
}
