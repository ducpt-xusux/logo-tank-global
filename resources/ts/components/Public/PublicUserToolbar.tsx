import { commonConstants, userConstants } from "@/constants";
import { RootState } from "@/helper/store";
import { ShoppingCartTypes } from "@/helper/type";
import { userService } from "@/services";
import { Popover, Transition } from "@headlessui/react";
import nProgress from "nprogress";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CartToolbar, MenuToolbar, QuestCircleToolbar, StarToolbar } from "../Icon";
import {getLocaleLink} from "@/helper/utils";

const PublicUserToolbar = () => {
    const dispatch = useDispatch();
    const [prodCount, setProdCount] = useState<number>(0);
    const user = useSelector((state: RootState) => state.authentication.user);
    const shoppingCart = useSelector((state: RootState) => state.system.shoppingCart);
    const { i18n, t } = useTranslation('common', { useSuspense: false });
    const favoriteCount = useSelector((state: RootState) => state.system.favoriteCount);
    useEffect(() => {
        if(user) {
            user.detail && user.detail.id && userService.getMyFavoritesCount().then(res => {
                dispatch({ type: commonConstants.SET_FAVORITE_COUNT, favoriteCount: res.count});
            })
        } else {
            dispatch({ type: commonConstants.SET_FAVORITE_COUNT, favoriteCount: 0});
        }
    }, []);

    useEffect(() => {
        if(user && user.detail) {
            const prdCount = shoppingCart.filter((item: ShoppingCartTypes) => item.userId == user.detail.id)
            setProdCount(prdCount.length);
        } else {
            const prdCount = shoppingCart.filter((item: ShoppingCartTypes) => !item.userId);
            setProdCount(prdCount.length);
        }
    }, [shoppingCart])

    const openLoginForm = () => {
        dispatch({ type: userConstants.SET_OPEN_SIGN_IN, openSignInForm: true });
        dispatch({ type: userConstants.SET_OPEN_SIGN_UP, openSignUpForm: false });
    }

    const logout = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        nProgress.start();
        await userService.logout();
        dispatch({ type: commonConstants.SET_FAVORITE_COUNT, favoriteCount: 0});
        dispatch({ type: userConstants.LOGOUT });
        nProgress.done();
    }

    return (
        <div className="flex col-span-2 justify-end items-center order-3">
            {i18n.language === 'vi' &&
                <Link
                    to={getLocaleLink('/order')}
                    className="rounded-lg pl-2 pr-2 mt-1 max-sp:text-[13px] h-[40px] xs:w-[196px] xs:h-[49px] bg-orange-450 flex items-center justify-center text-white
                    font-bold"
                >
                    Thuê chúng tôi
                </Link>
            }

        {!user?.access_token ? (
            <div className="hover:bg-gray-200 h-full xs:min-w-[50px] sm:min-w-[64px] p-2">
                <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={openLoginForm}
                >
                    <div className="mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="16" height="17.152" viewBox="0 0 16 17.152">
                            <g id="Group_2" data-name="Group 2" transform="translate(-880.072 -1970.742)">
                                <path id="Path_14" data-name="Path 14" d="M12.13,8.093A3.958,3.958,0,1,1,8.173,4.136,3.957,3.957,0,0,1,12.13,8.093Z" transform="translate(880.072 1967.106)" fill="none" stroke="#231815" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                                <path id="Path_15" data-name="Path 15" d="M15.5,20.288a5.951,5.951,0,0,0-5.952-5.951h-3.1A5.951,5.951,0,0,0,.5,20.288Z" transform="translate(880.072 1967.106)" fill="none" stroke="#231815" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                            </g>
                        </svg>
                    </div>
                    <div className="text-xs hidden sm:block">{t('headers.sign_in')}</div>
                </div>
            </div>
        ) : (
            <Popover className="relative h-full">
            {({ open }) => (
            <>
                <Popover.Button className="hover:bg-gray-200 h-full xs:min-w-[50px] sm:min-w-[64px] p-2">
                    <div className="flex flex-col items-center mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" width="16" height="17.152" viewBox="0 0 16 17.152">
                            <g id="Group_2" data-name="Group 2" transform="translate(-880.072 -1970.742)">
                                <path id="Path_14" data-name="Path 14" d="M12.13,8.093A3.958,3.958,0,1,1,8.173,4.136,3.957,3.957,0,0,1,12.13,8.093Z" transform="translate(880.072 1967.106)" fill="none" stroke="#231815" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                                <path id="Path_15" data-name="Path 15" d="M15.5,20.288a5.951,5.951,0,0,0-5.952-5.951h-3.1A5.951,5.951,0,0,0,.5,20.288Z" transform="translate(880.072 1967.106)" fill="none" stroke="#231815" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
                            </g>
                        </svg>
                    </div>
                    <div className="text-xs hidden sm:block">
                        {user?.detail?.name}
                    </div>
                </Popover.Button>
                <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
                >
                <Popover.Panel className="absolute left-1/2 z-10 mt-1 w-fit min max-w-sm -translate-x-1/2 transform px-4 sm:px-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="bg-white p-4 text-sm">
                            <div className="whitespace-nowrap font-bold min-w-[160px] text-center">
                                {user?.access_token ? user?.detail?.name : ''}{t('headers.my_page')}
                            </div>
                            <div>
                                <Link to={`/${i18n.language}/my-page/profile`}>
                                    <button  type="button" className="w-full hover:bg-gray-100 h-10">
                                        {t('headers.profile')}
                                    </button>
                                </Link>
                            </div>
                            <div>
                                <Link to={`/${i18n.language}/my-page/order-history`}>
                                    <button type="button" className="w-full hover:bg-gray-100 h-10">{t('headers.order_history')}</button>
                                </Link>
                            </div>
                            <button onClick={logout} type="button" className="w-full hover:bg-gray-100 h-10">{t('right_sidebar.sign_out')}</button>
                        </div>
                    </div>
                </Popover.Panel>
                </Transition>
            </>
            )}
            </Popover>
        )}
        <Popover className="relative h-full">
            {({ open }) => (
            <>
                <Popover.Button className="hover:bg-gray-200 h-full xs:min-w-[50px] sm:min-w-[64px] p-2">
                    <Link to={`/${i18n.language}/my-page/my-logo`}>
                        <div className="flex flex-col items-center mb-1">
                            <div className="relative w-8">
                                <StarToolbar />
                                <div className="absolute inline-flex items-center justify-center w-6 h-4 text-xs text-white bg-red-500 border-2 border-white rounded-full top-0 right-0 !text-[10px]">
                                    {favoriteCount > 99 ? `${99}+` : favoriteCount}
                                </div>
                            </div>
                        </div>
                        <div className="text-xs hidden sm:block">{t('headers.tank')}</div>
                    </Link>
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <Popover.Panel className="absolute left-1/2 z-10 mt-1 w-fit max-w-sm  min-w-[300px] -translate-x-1/2 transform pr-16 sm:px-0 lg:max-w-3xl ">
                        <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="bg-white p-4 whitespace-nowrap flex justify-center">
                            <StarToolbar className="h-14 w-14"/>
                        </div>
                        <div className="bg-gray-50 p-4 w-full text-sm ">
                            <p className="text-xs">{t('headers.note_2')}</p>
                        </div>
                        </div>
                    </Popover.Panel>
                </Transition>
            </>
            )}
        </Popover>
        <Link to={`/${i18n.language}/my-page/cart`}>
            <button type="button" className="hover:bg-gray-200 h-full xs:min-w-[50px] sm:min-w-[64px] p-2">
                <div className="flex flex-col items-center mb-1 relative">
                    <CartToolbar className="h-5 w-5 scale-125 mb-1"/>
                    <span className="absolute text-xs -top-0.5 right-[auto] text-amber-600">{prodCount > 9  ? ( <span>9<sup>+</sup></span> ) : prodCount}</span>
                </div>
                <div className="text-xs hidden sm:block">{t('headers.cart')}</div>
            </button>
        </Link>
        {/* <button type="button" className="hover:bg-gray-200 h-full xs:min-w-[50px] sm:min-w-[64px] p-2 hidden sm:block">
            <div className="flex flex-col items-center mb-1">
                <QuestCircleToolbar />
            </div>
            <div className="text-xs ">{t('headers.help')}</div>
        </button> */}
        {/* <Popover className="relative h-full">
            {({ open }) => (
            <>
                <Popover.Button className="hover:bg-gray-200 h-full xs:min-w-[50px] sm:min-w-[64px] p-2">
                    <div className="flex flex-col items-center mb-1">
                        <MenuToolbar />
                    </div>
                    <div className="text-xs hidden sm:block">{t('headers.menu')}</div>
                </Popover.Button>
                <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
                >
                <Popover.Panel className="absolute right-0 z-10 mt-1 w-screen max-w-sm -translate-x-0 transform px-4 sm:px-0 lg:max-w-5xl">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 mt-14 md:mt-0">
                        <div className="bg-white p-4 whitespace-nowrap flex justify-center grid grid-cols-2 sm:grid-cols-4">
                            <div className="px-4 space-y-2 text-sm mb-4">
                                <div>{t('toolbar_menu.title_1')}</div>
                                <hr className="h-px"/>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/what">{t('toolbar_menu.menu_1_1')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/flow">{t('toolbar_menu.menu_1_2')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/what/#anchor_request">{t('toolbar_menu.menu_1_3')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/works">{t('toolbar_menu.menu_1_5')}</a></div>
                                <br />
                                <div>{t('toolbar_menu.menu_1_6')}</div>
                                <hr className="h-px"/>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/ltw/tips">{t('toolbar_menu.menu_1_7')}</a></div>
                            </div>
                            <div className="px-4 space-y-2 text-sm mb-4">
                                <div>{t('toolbar_menu.title_2')}</div>
                                <hr className="h-px"/>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/order/">{t('toolbar_menu.menu_2_1')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/logomanual/">{t('toolbar_menu.menu_2_2')}</a></div>
                                <div><a className="!text-black hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/card_p/">{t('toolbar_menu.menu_2_3')}</a></div>
                                <br />
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/envelope/">{t('toolbar_menu.menu_2_4')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/web/">{t('toolbar_menu.menu_2_5')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/motionlogo/">{t('toolbar_menu.menu_2_6')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/postcard/">{t('toolbar_menu.menu_2_7')}</a></div>
                            </div>
                            <div className="px-4 space-y-2 text-sm mb-4">
                                <div>{t('toolbar_menu.title_3')}</div>
                                <hr className="h-px"/>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/seal/">{t('toolbar_menu.menu_3_1')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/ltw/item/pl_fc.html">{t('toolbar_menu.menu_3_2')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/doormat/">{t('toolbar_menu.menu_3_3')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/stamp/">{t('toolbar_menu.menu_3_4')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/ltw/quick_s/">{t('toolbar_menu.menu_3_5')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/flyer/">{t('toolbar_menu.menu_3_6')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/option/portrait/">{t('toolbar_menu.menu_3_7')}</a></div>
                            </div>
                            <div className="px-4 space-y-2 text-sm mb-4">
                                <div>{t('toolbar_menu.title_4')}</div>
                                <hr className="h-px"/>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/question">{t('toolbar_menu.menu_4_1')}</a></div>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/information">{t('toolbar_menu.menu_4_2')}</a></div>
                                <br />
                                <div>{t('toolbar_menu.menu_4_3')}</div>
                                <hr className="h-px"/>
                                <div><a className="hover:underline hover:text-black whitespace-normal" href="https://logo-tank.net/recruit">{t('toolbar_menu.menu_4_4')}</a></div>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
                </Transition>
            </>
            )}
        </Popover> */}
    </div>
    )
}

export default PublicUserToolbar;
