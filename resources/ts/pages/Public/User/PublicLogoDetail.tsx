import { useState, Fragment, useEffect, useRef } from 'react';
import {
    GuideIcon,
    PublicHeader,
    ChevronDownIcon,
    CheckIcon,
    LogoHorizontalExplain,
    DeliveredImages,
    OnlyLogoMark,
    OnlyMainName,
    OnlySubName,
    StarReverseColor,
    StarNormal,
    Loading,
    PublicFooter,
} from '@/components';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useTranslation } from 'react-i18next';
import { Listbox, Transition } from '@headlessui/react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/helper/store';
import { commonConstants, userConstants } from '@/constants';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { logoService, userService } from '@/services';
import {CustomSliderMethods, Logo} from '@/helper/type';
import { useForm } from 'react-hook-form';
import ButtonScrollTop from '@/components/ButtonScrollTop';
import MainLayout from '../Common/MainLayout';
import PublicMessageAddToCartModal from '@/components/Public/PublicMessageAddToCartModal';
import PublicRecommendLogo from '@/components/User/PublicRecommendLogo';
import PublicRecentlyLogo from '@/components/User/PublicRecentlyLogo';
import {Helmet} from "react-helmet";
import CustomSlider from '@/components/Slider';

const PublicLogoDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [loadingRecommend, setLoadingRecommend] = useState<boolean>(false);
    const [loadingRecently, setLoadingRecently] = useState<boolean>(false);
    const { i18n, t } = useTranslation('common', { useSuspense: false });
    const [favorite, setFavorite] = useState<boolean>(false);
    const [totalFavorite, setTotalFavorite] = useState<number>(0);
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [statusMsg, setStatusMsg] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [total, setTotal] = useState<number>(0);
    const [subName, setSubName] = useState<string>('');
    const [mainName, setMainName] = useState<string>('');
    const priceSettings = useSelector((state: RootState) => state.system.priceSettings);
    const user = useSelector((state: RootState) => state.authentication.user);
    const [logoDetail, setLogoDetail] = useState<Logo>();
    const [logosRecommended, setLogosRecommended] = useState<Logo[]>([]);
    const [recentlyViewedData, setRecentlyViewedData] = useState<Logo[]>([]);
    const [fileImageMulti, setFileImageMulti] = useState<Object[]>([]);

    const [formatParams, setFormatParams] = useState<object>({});
    const shoppingCartStore = useSelector((state: RootState) => state.system.shoppingCart);
    const recentlyViewedLogos = useSelector((state: RootState) => state.recently.recentlyViewedLogos);
    const favoriteCount = useSelector((state: RootState) => state.system.favoriteCount);
    const { id } = useParams<{ id?: string | undefined }>();
    const languageKeyword = useRef<string>('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const breadcrumbs = [
        {
            name: t('breadcrumbs.home'),
            path: '/'
        },
        {
            name: t('breadcrumbs.detail'),
            path: null
        },
    ];

    const fileFormatRow = [
        {fileFormat: 'Adobe illustrator', imageFormat: 'Vector', extension: '.ai'},
        {fileFormat: 'Adobe PDF', imageFormat: 'Vector', extension: '.pdf'},
        {fileFormat: 'PNG', imageFormat: 'Raster', extension: '.png'},
        {fileFormat: 'JPG', imageFormat: 'Raster', extension: '.jpg'},
        {fileFormat: 'SVG', imageFormat: 'Vector', extension: '.svg'},
    ];

    const logoManualOption = [
        { id: 1, name: t('logo_detail.no_thank'), value: 0 },
        { id: 2, name: t('logo_detail.logo_manual_option') + '  + {{price, currency}}', value: (priceSettings ? priceSettings.logo_manual_price[i18n.language] : 0)},
    ];
    const motionLogoOption = [
        { id: 1, name: t('logo_detail.no_thank'), value: 0 },
        { id: 2, name: t('logo_detail.motion_logo_option') + ' + {{price, currency}}', value: (priceSettings ? priceSettings.logo_motion_price[i18n.language] : 0)},
    ];

    const [selectedLogoManual, setSelectedLogoManual] = useState(logoManualOption[0]);
    const [selectedMotionLogo, setSelectedMotionLogo] = useState(motionLogoOption[0]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        if(!priceSettings) {
            userService.getPriceSetting().then(res => {
                const prices:any = {}
                for (const item of res.data) {
                    prices[item.key] = item.value
                }

                dispatch({ type: commonConstants.SET_PRICE_SETTING, priceSettings: prices });
            });
        }
    }, [])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
        setLoadingDetail(true);
        setLoadingRecommend(true);
        setLoadingRecently(true);
        if(!recentlyViewedLogos) {
            dispatch({ type: commonConstants.SET_RECENTLY_VIEWED_LOGO, recentlyViewedLogos: [id] });
        } else {
            const exist = recentlyViewedLogos.find((el:string) => el == id);
            if (!exist) {
                const recentlyViewed = recentlyViewedLogos.slice(-5);
                recentlyViewed.push(id ? id : '');
                dispatch({ type: commonConstants.SET_RECENTLY_VIEWED_LOGO, recentlyViewedLogos: recentlyViewed });
            }
        }
        id && logoService.getDetailLogo(id).then(res => {
            setLogoDetail(res.logo);
            res.logo.is_like && setFavorite(res.logo.is_like);
            setTotalFavorite(res.logo.favorites_count)
            setLoadingDetail(false);
        }).catch(err => {
            setLoadingDetail(false);
            console.error(err);
            navigate('/');
        });
        id && logoService.getLogosRecommended(parseInt(id)).then(res => {
            setLogosRecommended(res.logo_recommended);
            setLoadingRecommend(false);
        }).catch(err => {
            setLoadingRecommend(false);
            console.error(err);
        });

        recentlyViewedLogos && recentlyViewedLogos.length && logoService.searchLogoCondition({ logo_ids: recentlyViewedLogos}).then(res => {
            setRecentlyViewedData(res.data);
            setLoadingRecently(false);
        }).catch(err => {
            setLoadingRecently(false);
            console.error(err);
        });
    }, [location.pathname]);

    useEffect(() => {
        const locale = i18n.language;
        const currency = i18n.language == 'ja' ? 'JPY': (i18n.language == 'vi'? 'VND': 'USD');
        setFormatParams({
            currency,locale
        });
        setSelectedLogoManual(logoManualOption[0]);
        setSelectedMotionLogo(motionLogoOption[0]);

        calculatePrice();
    }, [i18n.language]);

    useEffect(() => {
        calculatePrice();
    }, [selectedLogoManual, selectedMotionLogo]);

    const favoriteEvent = (logoId: number, type:string = 'default') => {
        if(!user) {
            dispatch({ type: userConstants.SET_OPEN_SIGN_IN, openSignInForm: true });
            return
        }
        if(!favorite && (logoDetail?.inactive || logoDetail?.kept)) return;

        let like = true;
        switch (type) {
            case 'recommend':
                const newRecommend = logosRecommended.map((item:any) => {
                    if (item.logo_id == logoId) {
                        like = !item.is_like;
                        item.is_like = like;
                        like ? item.favorites_count += 1 : item.favorites_count -= 1;
                    }

                    return item;
                })
                setLogosRecommended(newRecommend);
                break;
            case 'recently':
                const newRecently = recentlyViewedData.map((item:any) => {
                    if (item.logo_id == logoId) {
                        like = !item.is_like;
                        item.is_like = like;
                        like ? item.favorites_count += 1 : item.favorites_count -= 1;
                    }

                    return item;
                })
                setRecentlyViewedData(newRecently);
                break;
            default:
                setFavorite(!favorite);
                setTotalFavorite(pre => pre + (!favorite ? 1: -1))
                like = !favorite;
                break;
        }
        dispatch({ type: commonConstants.SET_FAVORITE_COUNT, favoriteCount: like ? favoriteCount + 1 : favoriteCount - 1});
        logoService.favorite(logoId, like).then(() => {
            id && logoService.getDetailLogo(id).then(res => {
                setLogoDetail(res.logo);
                res.logo.is_like && setFavorite(res.logo.is_like);
            }).catch(err => {
                console.error(err);
                navigate('/');
            })
        })
    }

    useEffect(() => {
        logoService.checkLogoImageMulti(id).then(res => {
           setFileImageMulti(res.files);
        });
    },[id]);

    const changeLogoManual = (value:any) => {
        setSelectedLogoManual(value);
    }

    const changeMotionLogo = (value:any) => {
        setSelectedMotionLogo(value);
    }

    const calculatePrice = () => {
        const logoPrice = priceSettings.logo_price[i18n.language] ?? 0;
        const logoManualPrice = selectedLogoManual.value ? priceSettings.logo_manual_price[i18n.language] : 0;
        const logoMotionPrice = selectedMotionLogo.value ? priceSettings.logo_motion_price[i18n.language] : 0;
        const totalAmount = logoPrice + logoManualPrice + logoMotionPrice;
        setTotal(totalAmount);
    }

    const addToCart = () => {
        if (logoDetail?.inactive) return;
        if (logoDetail?.kept && !logoDetail?.is_user_kept) return;

        const cart = [...shoppingCartStore];
        const exist = cart.find(item => item.productId == logoDetail?.logo_id)
        if(!exist) {
            cart.push({
                userId: user && user.detail ? user.detail.id : 0,
                productId: logoDetail?.logo_id ?? 0,
                subName,
                mainName,
                logoMotion: !!selectedMotionLogo?.value,
                logoManual: !!selectedLogoManual?.value,
                product: logoDetail
            });
            dispatch({ type: userConstants.SET_SHOPPING_CART, shoppingCart: cart });
            setMessage(t('logo_detail.added_to_cart') + '');
            setStatusMsg(true)
            setOpenMessage(true);
            setTimeout(() => {
                setOpenMessage(false);
            }, 1000);
        } else {
            const msg = t('logo_detail.prod_cart_exist');
            setMessage(msg);
            setStatusMsg(false)
            setOpenMessage(true);
            setTimeout(() => {
                setOpenMessage(false);
            }, 1000);
        }
    }

    const getLogoName = () => {
        if (logoDetail?.logo_language && logoDetail?.logo_language[i18n.language]) {
            return logoDetail?.logo_language[i18n.language] as string;
        }else{
            if(i18n.language == 'en'){
                return 'In preparation';
            }else if(i18n.language == 'ja'){
                return logoDetail?.logo_name ? logoDetail?.logo_name : '準備中'
            }else{
                return 'Đang chuẩn bị';
            }
        }
    }
    const keywordLanguage = (item:any) => {
        switch (i18n.language) {
            case 'vi':
                languageKeyword.current = item?.keyword_language?.vi;
                break;
            case 'ja':
                languageKeyword.current = item?.keyword_language?.ja;
                break;
            case 'en':
                languageKeyword.current = item?.keyword_language?.en;
                break;
            default:
                break;
           }
           return languageKeyword?.current
    }

    const sliderRef = useRef<CustomSliderMethods>(null);

    const handleButtonClick = (index: number) => {
        if (sliderRef.current) {
            sliderRef?.current?.goToSlide(index);
        }
    };

    const infoFacePriceLanguage = (lang: string) => {
        if(lang == 'ja'){
            return 'JPY'
        } else if(lang == 'en'){
            return 'USD'
        } else {
            return 'VND'
        }
    }

    const infoPriceLanguage = (lang: string) => {
        if(lang == 'ja'){
            return '13,200'
        } else if(lang == 'en'){
            return '198'
        } else {
            return '968.000'
        }
    }
    const imageUrl = logoDetail?.src ? window.location.origin + logoDetail.src : "";

    const jsonLdData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": getLogoName(),
        "image":  imageUrl,
        "description": logoDetail && logoDetail.logo_explain ? logoDetail.logo_explain : '',
        "productID": id,
        "sku": id,
        "brand": {
          "@type": "Brand",
          "name": "LOGO TANK（ロゴタンク）"
        },
        "review": {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4",
            "bestRating": "5"
          },
          "author": {
            "@type": "Organization",
            "name": "株式会社クスクス",
            "url": "https://xusux.co.jp/"
          }
        },
        "offers": {
          "@type": "Offer",
          "url": imageUrl,
          "priceCurrency": infoFacePriceLanguage(i18n.language),
          "price": infoPriceLanguage(i18n.language),
          "priceValidUntil": "2050-01-01",
          "itemCondition": "https://schema.org/UsedCondition",
          "availability": "https://schema.org/InStock"
        }
      };

    return <div>
        <PublicHeader />
        <MainLayout>
            <Helmet>
                <title>{getLogoName() +" ("+ logoDetail?.logo_id + ') | Logo Tank Global' }</title>
                <meta
                    name="description"
                    content={getLogoName() +" ("+ logoDetail?.logo_id + (i18n.language == 'ja' ? ') | オリジナル ロゴマークが 税込13,200円で購入できる | Logo Tank Global' :
                        i18n.language == 'en' ? ') | Ready-made logos sold for$198.00(USD) | Logo Tank Global' :
                            ') | Cung cấp những thiết kế chuẩn có sẵn với giá chỉ 968,000₫ | Logo Tank Global')}
                />
                <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
            </Helmet>
            <div className="sm:pl-9 sm:pr-36 w-full py-2 max-w-[1280px] mx-auto">
                <div className="mb-3">
                    <Breadcrumb breadcrumbs={breadcrumbs}/>
                </div>
                {loadingDetail ? <Loading /> : null}
                <div className="flex flex-col sm:flex-row p-4">
                    <div className="md:min-w-[450px] sm:w-[600px]">
                        <div className="p-3 border relative w-auto">
                            <CustomSlider ref={sliderRef}>
                                { fileImageMulti.map((item: any, key: number) => {
                                    return(
                                        <div key={key}>
                                            <img src={item} alt={getLogoName()} className='w-full'/>
                                        </div>
                                    )
                                })}
                            </CustomSlider>
                            { logoDetail?.inactive && (
                                <div className="absolute z-[100] opacity-70 h-full w-full top-0 left-0">
                                    <div
                                        className={`drop-shadow-xl bg-slate-200 h-full w-full flex justify-center items-center
                                        ${i18n.language == 'ja' ? 'text-[40px]' : 'text-[28px]'} text-red-700 font-bold`}
                                    >
                                        {t('headers.sold_out')}
                                    </div>
                                </div>
                            )}
                            { logoDetail?.kept && (
                                <div className="absolute z-[100] opacity-70 h-full w-full bg-slate-50 top-0 left-0">
                                    <div
                                        className={`h-full w-full flex justify-center items-center
                                        ${i18n.language == 'ja' ? 'text-[40px]' : 'text-[28px]'} text-red-700 font-bold`}
                                    >
                                        <p className="drop-shadow-xl">
                                            {t('headers.negotiating')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className='grid grid-cols-5 gap-x-2.5'>
                            {fileImageMulti.map((item: any, key: number) => {
                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleButtonClick(key)}
                                        className='border mt-4'
                                    >
                                        <img src={item} alt={getLogoName()} className=''/>
                                    </button>
                                )
                            })}
                        </div>
                        <div className="p-3">
                            <div>
                                { t('logo_detail.category') }
                                {logoDetail?.colors?.map((item, key) => (
                                    <span key={`${item.id}_color`}> {(key ? '/ ': '') + item['name_' + i18n.language]}</span>
                                ))}
                            </div>
                            <div>
                                { t('logo_detail.type_industry') }
                                {logoDetail?.industries?.map((item: any, key) => (
                                    <span key={key}>{(key ? ' / ': '') + item['name_'+i18n.language] }</span>
                                ))}
                            </div>
                            <div>
                                { t('logo_detail.style') }
                                {logoDetail?.tastes?.map((item: any, key: number) => (
                                    <span key={key}>{(key ? '/ ': '') + item['name_'+i18n.language] }</span>
                                ))}
                            </div>
                            <div>
                                { t('logo_detail.alphabet') }
                                {logoDetail?.alphabets?.length ? logoDetail?.alphabets?.map((item: any, key) => (
                                    <span key={key}>{(key ? '/ ': '') + item.name }</span>
                                )): 'unset'}
                            </div>
                            <div>{
                                t('logo_detail.keyword') }
                                { logoDetail?.keywords?.map((item:any, key) => (
                                    <Link
                                        className="text-sky-500 hover:underline"
                                        key={key}
                                        to={`/${i18n.language}/search?u_keyword=${keywordLanguage(item)}`}
                                    >
                                        { item?.keyword_language?.vi && item?.keyword_language?.en && item?.keyword_language?.ja ?
                                            (key ? ' / ': '' ) + keywordLanguage(item) : ''}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <br />
                            <PublicRecommendLogo loading={loadingRecommend} logosRecommended={logosRecommended} favoriteEvent={favoriteEvent}/>
                            <PublicRecentlyLogo loading={loadingRecently} recentlyViewedData={recentlyViewedData} favoriteEvent={favoriteEvent}/>
                        </div>
                    </div>
                    <form
                        onSubmit={handleSubmit(addToCart)}
                        method="POST"
                    >
                        <div className="p-4">
                            <div className="mb-2">
                                {getLogoName()} （no.{logoDetail?.logo_id && logoDetail?.logo_id.toString().padStart(5, '0')}）
                            </div>
                            <hr className="border" />
                            <div>
                                <div className="flex mt-2">
                                    <div className="text-sm text-neutral-600 w-2/3 leading-7">
                                        {totalFavorite + (logoDetail?.tank_num_logo_tank_jp ?? 0)}{t('logo_detail.people_registered')}
                                    </div>
                                    <div className="flex items-center ml-4">
                                        <div>{totalFavorite + (logoDetail?.tank_num_logo_tank_jp ?? 0)}</div>
                                        <div
                                            className="ml-2"
                                            onClick={() => favoriteEvent(logoDetail && logoDetail.logo_id ? logoDetail.logo_id : 0)}
                                        >
                                            { favorite ?
                                                <StarNormal className="h-4 w-4 cursor-pointer" /> :
                                                <StarReverseColor className="h-4 w-4 cursor-pointer"/>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <br />
                                <div className="text-xl">
                                    {t('{{price, currency}}', {
                                        price: priceSettings.logo_price[i18n.language],
                                        formatParams: {
                                            price: formatParams
                                        }
                                    })}  ({t('logo_detail.with_tax')})
                                </div>
                                <br />
                                <div className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="sub_name"
                                            className="block mb-2 text-neutral-600"
                                        >
                                            <div className="flex items-end pr-6">
                                                <div>{ t('logo_detail.sub_name') }</div>
                                                <div className="ml-4">
                                                    <span data-tooltip-target="tooltip-default" className="mt-1 ml-4">
                                                        <div className="relative sm:max-w-xl sm:mx-auto">
                                                            <div className="relative flex flex-col items-center group">
                                                                <GuideIcon className="h-5 group cursor-pointer relative inline-block text-center" />
                                                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                                                    <span
                                                                        className="w-56 relative z-10 p-2 text-xs leading-none
                                                                        text-white whitespace-no-wrap bg-black shadow-lg"
                                                                    >
                                                                        {t('logo_detail.guide_1')}
                                                                    </span>
                                                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            {...register("sub_name", { required: { value: true, message: 'Sub name is required' }})}
                                            onChange={(e) =>
                                                setSubName(e.target.value)
                                            }
                                            value={subName}
                                            type="sub_name"
                                            name="sub_name"
                                            id="sub_name"
                                            placeholder=""
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                                            focus:ring-sky-600 focus:border-sky-600 block w-2/3 sm:w-1/3 p-2.5"
                                        />
                                        {errors.sub_name && <p className="text-red-600">{errors?.sub_name?.message + ''}</p>}
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="main_name"
                                            className="block mb-2 text-neutral-600"
                                        >
                                            <div className="flex items-end pr-6">
                                                <div>{ t('logo_detail.main_name') }</div>
                                                <div className="ml-4">
                                                    <span data-tooltip-target="tooltip-default" className="mt-1 ml-4">
                                                        <div className="relative sm:max-w-xl sm:mx-auto">
                                                            <div className="relative flex flex-col items-center group">
                                                                <GuideIcon className="h-5 group cursor-pointer relative inline-block text-center" />
                                                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                                                    <span className="w-56 relative z-10 p-2 text-xs
                                                                    leading-none text-white whitespace-no-wrap bg-black shadow-lg">
                                                                        {t('logo_detail.guide_2')}
                                                                    </span>
                                                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            {...register("main_name", { required: { value: true, message: 'Main name is required' }})}
                                            onChange={(e) =>
                                                setMainName(e.target.value)
                                            }
                                            value={mainName}
                                            type="main_name"
                                            name="main_name"
                                            id="main_name"
                                            placeholder=""
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg
                                            focus:ring-sky-600 focus:border-sky-600 block w-2/3 sm:w-1/3 p-2.5"
                                        />
                                        {errors.main_name && <p className="text-red-600">{errors?.main_name?.message + ''}</p>}
                                    </div>
                                    <br />
                                    <hr />
                                    <br />
                                    <div>
                                        <label
                                            htmlFor="user_guide"
                                            className="block mb-2 text-neutral-600"
                                        >
                                            <div className="flex items-end pr-6">
                                                <div>{t('logo_detail.logo_manual')}</div>
                                                <div className="ml-4">
                                                    <span data-tooltip-target="tooltip-default" className="mt-1 ml-4">
                                                        <div className="relative sm:max-w-xl sm:mx-auto">
                                                            <div className="relative flex flex-col items-center group">
                                                                <GuideIcon className="h-5 group cursor-pointer relative inline-block text-center" />
                                                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                                                    <span className="w-56 relative z-10 p-2 text-xs leading-none
                                                                    text-white whitespace-no-wrap bg-black shadow-lg">
                                                                        {t('logo_detail.guide_3')}
                                                                    </span>
                                                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                        <Listbox value={selectedLogoManual} onChange={changeLogoManual}>
                                            <div className="relative w-2/3 sm:w-1/2 mt-1">
                                                <Listbox.Button
                                                    className="border relative w-full rounded-lg bg-white cursor-pointer
                                                    py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm"
                                                >
                                                    <span className="block truncate">{selectedLogoManual.name}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options
                                                        className="z-100 absolute mt-1 max-h-60 w-full overflow-auto
                                                        rounded-md bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm"
                                                    >
                                                    {logoManualOption.map((item, index) => (
                                                        <Listbox.Option
                                                            key={index}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                                }`
                                                            }
                                                            value={{name: t(item.name, {
                                                                price: priceSettings.logo_manual_price[i18n.language],
                                                                formatParams: {
                                                                    price: formatParams
                                                                }
                                                            }), value: item.value, id: item.id}}
                                                        >
                                                        {({ selected }) => (
                                                            <>
                                                            <span
                                                                className={`block truncate ${
                                                                selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                            >
                                                                {t(item.name, {
                                                                    price: priceSettings.logo_manual_price[i18n.language],
                                                                    formatParams: {
                                                                        price: formatParams
                                                                    }
                                                                })}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                            </>
                                                        )}
                                                        </Listbox.Option>
                                                    ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <br />
                                    <div>
                                        <label
                                            htmlFor="logo_motion"
                                            className="block mb-2 text-neutral-600"
                                        >
                                            <div className="flex items-end pr-6">
                                                <div>{t('logo_detail.motion_logo')}</div>
                                                <div className="ml-4">
                                                    <span data-tooltip-target="tooltip-default" className="mt-1 ml-4">
                                                        <div className="relative sm:max-w-xl sm:mx-auto">
                                                            <div className="relative flex flex-col items-center group">
                                                                <GuideIcon className="h-5 group cursor-pointer relative inline-block text-center" />
                                                                <div className="absolute bottom-0 flex-col items-center hidden mb-6 group-hover:flex">
                                                                    <span
                                                                        className="w-56 relative z-10 p-2 text-xs leading-none
                                                                        text-white whitespace-no-wrap bg-black shadow-lg"
                                                                    >
                                                                        {t('logo_detail.guide_4')}
                                                                    </span>
                                                                    <div className="w-3 h-3 -mt-2 rotate-45 bg-black"></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                        <Listbox value={selectedMotionLogo} onChange={changeMotionLogo}>
                                            <div className="relative w-2/3 sm:w-2/5 mt-1">
                                                <Listbox.Button
                                                    className="border relative w-full rounded-lg bg-white cursor-pointer
                                                    py-2 pl-3 pr-10 text-left shadow-md focus:outline-none sm:text-sm"
                                                >
                                                    <span className="block truncate">{selectedMotionLogo.name}</span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                    <ChevronDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options
                                                        className="z-100 absolute mt-1 max-h-60 w-full overflow-auto rounded-md
                                                        bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5
                                                        focus:outline-none sm:text-sm"
                                                    >
                                                    {motionLogoOption.map((item, index) => (
                                                        <Listbox.Option
                                                        key={index}
                                                        className={({ active }) =>
                                                            `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                                            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                                            }`
                                                        }
                                                        value={{name: t(item.name, {
                                                            price: priceSettings.logo_motion_price[i18n.language],
                                                            formatParams: {
                                                                price: formatParams
                                                            }
                                                        }), value: item.value, id: item.id}}
                                                        >
                                                        {({ selected }) => (
                                                            <>
                                                            <span
                                                                className={`block truncate ${
                                                                selected ? 'font-medium' : 'font-normal'
                                                                }`}
                                                            >
                                                                {t(item.name, {
                                                                    price: priceSettings.logo_motion_price[i18n.language],
                                                                    formatParams: {
                                                                        price: formatParams
                                                                    }
                                                                })}
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                            </>
                                                        )}
                                                        </Listbox.Option>
                                                    ))}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl">
                                            {t('logo_detail.total')} { t('{{price, currency}}',
                                            { price: total, formatParams: { price: formatParams }})}
                                        </span>
                                        <span className="ml-2">({t('logo_detail.with_tax')})</span>
                                    </div>
                                    <hr />
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={logoDetail?.inactive || (logoDetail?.kept && logoDetail?.is_user_kept==false)}
                                            className={`w-80 text-white ${logoDetail?.inactive || (logoDetail?.kept && logoDetail?.is_user_kept==false) ?
                                                'bg-gray-600 hover:bg-gray-700' : 'bg-orange-600 hover:bg-orange-700'}
                                                focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded
                                                text-sm px-5 py-2.5 text-center`}
                                        >
                                            {t('logo_detail.add_cart')}
                                        </button>
                                    </div>
                                    <br />
                                    <div className="text-neutral-600">
                                        <div>
                                            { t('logo_detail.des_line_1') }
                                        </div>
                                        <div>
                                            { t('logo_detail.des_line_2') }
                                        </div>
                                        <div>
                                            { t('logo_detail.des_line_3') }
                                        </div>
                                        <br />
                                        <div className="font-medium">
                                            { t('logo_detail.ordering_process') }
                                        </div>
                                        <div>
                                            { t('logo_detail.order_via_internet') }
                                        </div>
                                        <div>
                                            { t('logo_detail.payment') }
                                        </div>
                                        <div>
                                            { t('logo_detail.logo_confirm') }
                                        </div>
                                        <div>
                                            { t('logo_detail.design_finalization') }
                                        </div>
                                        <div>
                                            { t('logo_detail.delivery') }
                                        </div>
                                        <br />
                                        <div className="font-medium">
                                            { t('logo_detail.file_format_delivery') }
                                        </div>
                                        <div>
                                            { t('logo_detail.following_file_formats') }
                                        </div>
                                        <div>
                                            { t('logo_detail.industry_standard') }
                                        </div>
                                        <div>
                                            { t('logo_detail.please_use_it') }
                                        </div>
                                    </div>
                                    <div className='text-neutral-600'>
                                        <table className="w-full text-sm text-left text-gray-500 border">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 border text-center">
                                                        { t('logo_detail.file_format') }
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 border text-center">
                                                        { t('logo_detail.image_format') }
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 border text-center">
                                                        { t('logo_detail.extension') }
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {fileFormatRow.map((item, key) => (
                                                    <tr key={key} className="bg-white border">
                                                        <td scope="row" className="px-6 py-4 border">
                                                            {item.fileFormat}
                                                        </td>
                                                        <td className="px-6 py-4 border text-center">
                                                            {item.imageFormat}
                                                        </td>
                                                        <td className="px-6 py-4 border text-center">
                                                            {item.extension}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-neutral-600">
                                        <div className="font-medium">
                                            { t('logo_detail.about_delivered') }
                                        </div>
                                        <div>
                                            { t('logo_detail.deliver_separate') }
                                        </div>
                                        <div>
                                            { t('logo_detail.purpose_use') }
                                        </div>
                                        <div>
                                            { t('logo_detail.depending_design') }
                                        </div>
                                    </div>
                                    <div className="flex items-center flex-col sm:flex-row text-neutral-600">
                                        <div className="w-full sm:w-1/2">
                                            <div className="font-medium">
                                                { t('logo_detail.des_logo_mark') }
                                            </div>
                                            <div className="font-medium">
                                                { t('logo_detail.des_main_name') }
                                            </div>
                                            <div className="font-medium">
                                                { t('logo_detail.des_sub_name') }
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <LogoHorizontalExplain />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="text-neutral-600">
                                        <div>
                                            <div className="font-medium">
                                                { t('logo_detail.delivered_images') }
                                            </div>
                                            <div>
                                                { t('logo_detail.des_delivered_images') }
                                            </div>
                                        </div>
                                        <br />
                                        <div className="flex sm:justify-center">
                                            <DeliveredImages />
                                        </div>
                                    </div>
                                    <br />
                                    <div className="flex flex-col sm:flex-row text-neutral-600 ">
                                        <div className="w-1/2">
                                            <div>{ t('logo_detail.only_logo_mark') }</div>
                                            <div>
                                                <OnlyLogoMark />
                                            </div>
                                        </div>
                                        <div className="ml-0 sm:ml-3">
                                            <div>{ t('logo_detail.only_main_name') }</div>
                                            <div><OnlyMainName /></div>
                                        </div>
                                    </div>
                                    <div className="text-neutral-600">
                                        <div>{ t('logo_detail.only_sub_name') }</div>
                                        <div className="flex sm:justify-center"><OnlySubName /></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="sm:hidden">
                        <PublicRecommendLogo loading={loadingRecommend} logosRecommended={logosRecommended} favoriteEvent={favoriteEvent}/>
                        <PublicRecentlyLogo loading={loadingRecently} recentlyViewedData={recentlyViewedData} favoriteEvent={favoriteEvent}/>
                    </div>
                </div>
            </div>
            <PublicMessageAddToCartModal open={openMessage} message={message} status={statusMsg}/>
            <ButtonScrollTop />
            <PublicFooter />
        </MainLayout>
    </div>
}

export default PublicLogoDetail;