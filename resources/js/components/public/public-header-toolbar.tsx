import { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import {
    ChevronDown,
    CircleUser,
    ShoppingBag,
    LogOut,
    User,
    ClipboardList,
    Package2,
    ChevronUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Container } from "./container";
import SignIn from "@/components/user/sign-in";
import { SharedData } from "@/types";
import { usePackageCartStore } from "@/stores/package-cart.storage";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components";
import { getLocaleLink } from "@/helper/utils";
import { useSystemStore } from "@/stores";

export const PublicHeaderToolbar = () => {
    const { t } = useTranslation("common", { useSuspense: false });
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const [showSignIn, setShowSignIn] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
    const { shoppingCart } = useSystemStore();
    const { packageCart } = usePackageCartStore();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("show_login") === "true") {
            setShowSignIn(true);
            // Remove the query parameter so it doesn't trigger again on refresh
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }, []);

    const cartCount = (shoppingCart?.length || 0) + (packageCart?.length || 0);
    const handleLogout = () => {
        router.post(route("logout"));
    };
    return (
        <>
            <Container className="grid h-16 grid-cols-2 items-center gap-4 md:h-[108px] md:grid-cols-12">
                <div className="flex justify-start md:col-span-2">
                    <Link href={getLocaleLink("")}>
                        <img
                            src="/img/logo-full.svg"
                            alt="logo-tank"
                            className="h-8 md:h-auto"
                        />
                    </Link>
                </div>

                {/*HomePage Logo Category - Hidden on Mobile*/}
                <div className="col-span-5 hidden flex-row justify-center md:flex md:gap-3 md:pl-0 lg:gap-8 lg:pl-8">
                    <Link href="#">
                        <span className="mx-1 flex items-center gap-1 whitespace-nowrap uppercase transition-colors hover:text-[#FF8D26] md:text-[13px] lg:text-base">
                            {t("headers.homepage")}
                        </span>
                    </Link>
                    <Link href="#">
                        <span className="mx-1 flex items-center gap-1 whitespace-nowrap uppercase transition-colors hover:text-[#FF8D26] md:text-[13px] lg:text-base">
                            {t("headers.logo")}{" "}
                            <ChevronDown
                                size={16}
                                className="md:h-4 md:w-4 lg:h-5 lg:w-5"
                            />
                        </span>
                    </Link>
                    <Link href="#">
                        <span className="mx-1 flex items-center gap-1 whitespace-nowrap uppercase transition-colors hover:text-[#FF8D26] md:text-[13px] lg:text-base">
                            {t("headers.category")}{" "}
                            <ChevronDown
                                size={16}
                                className="md:h-4 md:w-4 lg:h-5 lg:w-5"
                            />
                        </span>
                    </Link>
                </div>

                {/* Contact Us Button - Hidden on Mobile */}
                <Link
                    href={getLocaleLink("/contact-us")}
                    className="col-span-3 hidden justify-center md:flex"
                >
                    <button className="bg-brand flex cursor-pointer items-center justify-center rounded-lg px-2 font-bold whitespace-nowrap text-white hover:bg-[#E67E00] md:h-[40px] md:w-[150px] md:text-[15px] lg:h-[50px] lg:w-[200px] lg:text-[20px]">
                        {t("headers.contact_us")}
                    </button>
                </Link>

                {/* Right side icons */}
                <div className="flex items-center justify-end gap-2 text-[#474747] md:col-span-2 md:gap-4">
                    {/* User Info / Login */}
                    {!auth?.user ? (
                        <button
                            onClick={() => setShowSignIn(true)}
                            className="flex min-w-[50px] flex-col items-center justify-center rounded-md p-2 transition-colors hover:bg-gray-100 hover:text-[#FF8D26] md:min-w-[64px]"
                        >
                            <CircleUser
                                className="mb-1 h-[26px] w-[26px] cursor-pointer md:h-7 md:w-7"
                                strokeWidth={1.5}
                            />
                            <span className="hidden text-xs whitespace-nowrap sm:block">
                                {t("headers.sign_in", "Sign in")}
                            </span>
                        </button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex min-w-[50px] flex-col items-center justify-center rounded-md p-2 transition-colors outline-none hover:bg-gray-100 hover:text-[#FF8D26] md:min-w-[64px]">
                                <CircleUser
                                    className="mb-1 h-[26px] w-[26px] md:h-7 md:w-7"
                                    strokeWidth={1.5}
                                />
                                <span className="hidden max-w-[80px] truncate text-xs sm:block">
                                    {auth.user.name?.split(" ")[0] || "User"}
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="mt-2 w-56"
                            >
                                <DropdownMenuLabel className="text-center font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm leading-none font-medium">
                                            {auth.user.name}
                                        </p>
                                        <p className="text-muted-foreground text-xs leading-none wrap-break-word">
                                            {auth.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer"
                                    >
                                        <Link
                                            href={getLocaleLink(
                                                "/user-information",
                                            )}
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>
                                                {t(
                                                    "headers.profile",
                                                    "Profile",
                                                )}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        asChild
                                        className="cursor-pointer"
                                    >
                                        <Link href="#">
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            <span>
                                                {t(
                                                    "headers.order_history",
                                                    "Order history",
                                                )}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>
                                        {t(
                                            "right_sidebar.sign_out",
                                            "Sign out",
                                        )}
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}

                    {/* Shopping Cart with Dropdown (Responsive) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex min-w-[50px] flex-col items-center justify-center rounded-md p-2 transition-colors outline-none hover:bg-gray-100 hover:text-[#FF8D26] md:min-w-[64px]">
                                <div className="relative mb-1">
                                    <ShoppingBag
                                        className="h-[26px] w-[26px] md:h-7 md:w-7"
                                        strokeWidth={1.5}
                                    />
                                    <span className="absolute -top-1 -right-2 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#FF8D26] text-[9px] text-white md:h-5 md:w-5 md:text-[10px]">
                                        {cartCount > 9 ? "9+" : cartCount}
                                    </span>
                                </div>
                                <span className="hidden text-xs whitespace-nowrap sm:block">
                                    {t("headers.cart", "Cart")}
                                </span>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="mt-2 w-56">
                            <DropdownMenuLabel>
                                {t("headers.cart", "Shopping Cart")}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link href={getLocaleLink("/my-page/cart")}>
                                        <div className="flex w-full items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                <span>Logo Cart</span>
                                            </div>
                                            <div className="bg-brand flex h-[20px] w-[20px] items-center justify-center rounded-full text-[10px] text-white">
                                                {shoppingCart.length}
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer"
                                >
                                    <Link
                                        href={getLocaleLink(
                                            "/my-page/package-cart",
                                        )}
                                    >
                                        <div className="flex w-full items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <Package2 className="mr-2 h-4 w-4" />
                                                <span>Package Cart</span>
                                            </div>
                                            <div className="bg-brand flex h-[20px] w-[20px] items-center justify-center rounded-full text-[10px] text-white">
                                                {packageCart.length}
                                            </div>
                                        </div>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="cursor-pointer p-2 text-[#474747] md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <ChevronUp size={24} />
                        ) : (
                            <ChevronDown size={24} />
                        )}
                    </button>
                </div>

                {/* SignIn Modal Component */}
                <div className="z-101">
                    <SignIn open={showSignIn} setOpenLogin={setShowSignIn} />
                </div>
            </Container>

            <div
                className={`absolute top-full left-0 z-50 w-full overflow-hidden bg-white shadow-lg transition-all duration-300 ease-in-out md:hidden ${
                    isMobileMenuOpen
                        ? "max-h-[400px] border-t border-gray-100 opacity-100"
                        : "max-h-0 border-transparent opacity-0"
                }`}
            >
                <nav className="flex flex-col px-4 py-4">
                    <Link
                        href="#"
                        className="flex items-center border-b border-gray-100 py-3"
                    >
                        <span className="text-sm font-semibold text-[#474747] uppercase hover:text-[#FF8D26]">
                            {t("headers.homepage")}
                        </span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center justify-between border-b border-gray-100 py-3"
                    >
                        <span className="text-sm font-semibold text-[#474747] uppercase hover:text-[#FF8D26]">
                            {t("headers.logo")}
                        </span>
                        <ChevronDown size={16} className="text-[#474747]" />
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center justify-between border-b border-gray-100 py-3"
                    >
                        <span className="text-sm font-semibold text-[#474747] uppercase hover:text-[#FF8D26]">
                            {t("headers.category")}
                        </span>
                        <ChevronDown size={16} className="text-[#474747]" />
                    </Link>
                    <div className="mt-6 flex flex-col gap-3">
                        <Link
                            href={getLocaleLink("/contact-us")}
                            className="w-full"
                        >
                            <button className="flex h-12 w-full cursor-pointer items-center justify-center rounded-lg bg-[#FF8D26] text-base font-bold text-white transition-colors hover:bg-[#E67E00]">
                                {t("headers.contact_us")}
                            </button>
                        </Link>
                    </div>
                </nav>
            </div>
        </>
    );
};
