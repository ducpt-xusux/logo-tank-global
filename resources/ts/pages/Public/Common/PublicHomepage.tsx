import React, { useEffect, useState } from "react";
import {
    LoadingIcon,
    LogoWithLoading,
    PublicFooter,
    PublicHeader,
    StarNormal,
    StarReverseColor
} from "@/components";
import { useTranslation } from "react-i18next";
import ButtonScrollTop from "@/components/ButtonScrollTop";
import { logoService } from "@/services";
import { Link } from "react-router-dom";
import { commonConstants, userConstants } from "@/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/helper/store";
import MainLayout from "./MainLayout";
import PublicPaginate from "@/components/Public/PublicPaginate";
import {Logo} from "@/helper/type";

const PublicHomepage = () => {
    const dispatch = useDispatch();
    const [logos, setLogos] = useState<Logo[]>([]);
    const { i18n, t } = useTranslation('common', { useSuspense: false });
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(100);
    const [limit, setLimit] = useState<number>(100);
    const [loading, setLoading] = useState(false);
    const favoriteCount = useSelector((state: RootState) => state.system.favoriteCount);
    const authentication = useSelector((state: RootState) => state.authentication);

    useEffect(() => {
        getLogos(page);
    }, [page])

    const getMoreLogo = () => {
        setPage(pre => +pre + 1);
    }

    const getLogos = (_page:number) => {
        setLoading(true)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        logoService.getPublicAllLogo(limit,_page, {
            state: '',
            keyword: '',
            designers: ''
        }).then(res => {
            setLogos(res.data);
            setLastPage(res.meta.last_page);

        }).catch((err) => {
            console.error(err);
        }).then(() => {
            setLoading(false);
        });
    }

    const checkImage = (logoId: number) => {
        let extension = 'gif';
        // @ts-ignore
        let url = `${baseUrl}/logo/logo_data/${logoId}.${extension}`;
        return checkImageExists(url).then(() => {
            return url;
        }).catch(() => {
            extension = 'png';
            // @ts-ignore
            return `${baseUrl}/logo/logo_data/${logoId}.${extension}`;
        });
    }
    const checkImageTwo = (logoId: number, url_img_two: string) => {
        let url = '';
        if(url_img_two){
            // @ts-ignore
            url = url_img_two;
        }
        return url;
    }

    const checkImageExists = (url: string) => {
        return new Promise<void>((resolve, reject) => {
            const img = new Image();
            img.onload = function() {
                resolve();
            };
            img.onerror = function() {
                reject();
            };
            img.src = url;
        });
    }

    const getLogoName = (item: any) => {
        if (item.logo_language) {
            return item.logo_language[i18n.language];
        }else{
            if(i18n.language == 'en'){
                return 'In preparation'
            }else if(i18n.language == 'ja'){
                return item?.logo_name ? item?.logo_name : '準備中'
            }else{
                return 'Đang chuẩn bị'
            }
        }
    }

    const favoriteEvent = async (logoId: number, like: boolean) => {
        if(authentication.loggedIn) {
            logoService.favorite(logoId, like);
            dispatch({ type: commonConstants.SET_FAVORITE_COUNT, favoriteCount: favoriteCount + (like ? 1 : -1)});
            const newLogos = logos.map((item: any) => {
                if (item.logo_id == logoId) {
                    item.is_like = like;
                    item.favorites_count += (like ? 1 : -1);

                    return item;
                }

                return  item;
            })
            setLogos(newLogos);
        } else {
            dispatch({ type: userConstants.SET_OPEN_SIGN_IN, openSignInForm: true });
        }
    }

    return <>
        <PublicHeader />
        <MainLayout>
            <div className={`flex justify-center relative ${i18n.language == 'vi' ? 'pt-[30px]' : 'pt-[0px]'} md:pt-[0px]`}>
                <img src={i18n.language == 'vi' ? `/img/top/bg_top_vn.jpg` : `/img/top/bg_top.png`} alt="" />
            </div>

            <div className="pt-9 pb-12 text-center max-md:ml-[5px] max-md:mr-[5px]">
                <p className="mb-2 ">{ t('home.intro_1') }</p>
                <p className="text-orange-600 text-xl mb-2">{ t('home.intro_2') }</p>
                <p className="mb-2 ">{ t('home.intro_3') }</p>
                <p className="font-bold text-neutral-500">{ t('home.intro_4') }</p>
            </div>

            { !loading && <div
                className="flex items-center justify-center flex-wrap grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8
                max-w-[980px] lg:mx-auto"
            >
                {logos.map(item => (
                    <div key={`logo_${item.logo_id}`} className="border h-44 w-44 sm:h-52 sm:w-52 relative">
                        <Link  to={`logo/detail/${item.logo_id}`}>
                            <div className="group">
                                <LogoWithLoading logo={item} getLogoName={getLogoName} />
                                {checkImageTwo(item?.logo_id, item?.url_img_two) && (
                                    <img
                                        className="absolute opacity-0 inset-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                                        src={checkImageTwo(item.logo_id, item?.url_img_two)}
                                        alt= {getLogoName(item)}
                                    />
                                )}
                                <div className="absolute bottom-2 md:left-2 text-neutral-500 font-bold truncate w-40 sm:w-44 text-center">
                                    {getLogoName(item)}
                                </div>
                            </div>
                        </Link>
                        { item.inactive ? (
                            <div className="absolute z-[100] opacity-70 h-full w-full">
                                <div className={`bg-slate-200 h-full w-full flex justify-center items-center
                                ${i18n.language == 'ja' ? 'text-[40px]' : 'text-[28px]'} text-red-700 font-bold`}
                                >
                                    {t('headers.sold_out')}
                                </div>
                            </div>
                        ) : null}
                        { item.kept ? (
                            <div className="absolute z-[100] opacity-70 h-full w-full bg-slate-50">
                                <div
                                    className={`h-full w-full flex justify-center items-center
                                    ${i18n.language == 'ja' ? 'text-[40px]' : 'text-[28px]'} text-red-700 font-bold`}>
                                    <p className="">
                                        {t('headers.negotiating')}
                                    </p>
                                </div>
                            </div>
                        ) : null}
                        <div
                            onClick={() => favoriteEvent(item.logo_id, !item.is_like)}
                            className="z-2 absolute right-2 top-2 flex items-center bg-gray-100 rounded-xl p-1 h-5"
                        >
                            <span className={`text-xs ${item.is_like ? 'text-amber-600': ''}`}>
                                {item.favorites_count + (item.tank_num_logo_tank_jp ? item.tank_num_logo_tank_jp : 0)}
                            </span>
                            { item.is_like ?
                                <StarNormal className="ml-2 h-4 w-4 cursor-pointer" fill="#d97706" /> :
                                <StarReverseColor className="ml-2 h-4 w-4 cursor-pointer" /> }
                        </div>
                    </div>
                ))}
            </div>}
            <div className="flex justify-center items-center">
                { loading && <div ><LoadingIcon size={10} className="text-orange-600"/></div>}
            </div>


            <div className="flex flex-col sm:flex-row items-center justify-center mt-14 mb-16 relative max-w-[980px] mx-auto">
                {lastPage != page && logos.length ? (<button
                    onClick={getMoreLogo}
                    className="w-52 h-10 flex justify-center items-center text-white rounded bg-orange-600 text-lg"
                >
                    { t('home.next') }
                </button>) : null }
                {logos.length && lastPage > 1 ? (
                    <div className="md:absolute right-0 sm:mr-4 mt-4 sm:mt-0">
                        <PublicPaginate page={page} lastPage={lastPage} setPage={setPage} />
                    </div>
                ) : null}
            </div>

            <ButtonScrollTop />
            <PublicFooter />
        </MainLayout>
    </>
}
export default PublicHomepage;
