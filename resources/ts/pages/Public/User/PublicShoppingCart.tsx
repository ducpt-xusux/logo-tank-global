import {useEffect, useState} from 'react';
import {Breadcrumb, Loading, PublicHeader, QRIcon} from '@/components';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/helper/store';
import {logoService} from '@/services';
import {useTranslation} from 'react-i18next';
import {commonConstants, userConstants} from '@/constants';
import {ToastContainer} from "react-toastify";
import {Link, useNavigate} from 'react-router-dom';
import {PaymentMethod, ShoppingCartTypes} from '@/helper/type';
import PublicMessageAddToCartModal from '@/components/Public/PublicMessageAddToCartModal';
import {getLogoPrice, getManualPrice, getMotionPrice} from "@/helper/utils";

const PublicShoppingCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {i18n, t} = useTranslation('common', {useSuspense: false});
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [logoList, setLogoList] = useState<Object[]>([]);
    const [formatParams, setFormatParams] = useState<Object>({});
    const priceSettings = useSelector((state: RootState) => state.system.priceSettings);
    const shoppingCartStore = useSelector((state: RootState) => state.system.shoppingCart);
    const authentication = useSelector((state: RootState) => state.authentication);
    const loading = useSelector((state: RootState) => state.system.loading);
    const favoriteCount = useSelector((state: RootState) => state.system.favoriteCount);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>();

    const breadcrumbs = [
        {
            name: t('breadcrumbs.home'),
            path: '/'
        },
        {
            name: t('shopping_cart.title'),
            path: null
        },
    ];

    const paymentMethods: PaymentMethod[] = [
        {
            id: 1,
            name: <div className="w-full flex items-center">
                <div>Credit Card</div>
                <div className="text-sm font-light ml-1">(with Stripe)</div>
            </div>,
            short_name: 'Credit Card(with Stripe)',
            icon: <img className="h-9" src="/img/credit-card.png" alt="credit-card"/>,
            active: true
        },
        {
            id: 2,
            name: <div className="flex items-center ml-2">QR Scan</div>,
            short_name: 'QR Scan',
            icon: <QRIcon className="h-9 w-9"/>,
            active: true
        },
        {
            id: 3,
            name: <div className="flex items-center ml-2">momo</div>,
            short_name: 'momo',
            icon: <img className="h-9 w-9" src="/img/logo-momo.png" alt=""/>,
            active: false
        },
        {
            id: 4,
            name: <div className="flex items-center ml-2">ZaloPay</div>,
            short_name: 'ZaloPay',
            icon: <img className="h-9 w-9" src="/img/logo-zalopay.png" alt=""/>,
            active: false
        },
    ]

    useEffect(() => {
        dispatch({type: commonConstants.SET_LOADING, loading: true});
        const productIDs: number[] = shoppingCartStore.map((item: ShoppingCartTypes) => item.productId);
        let uniqueArray: number[] = [...new Set(productIDs)];
        logoService.searchLogoCondition({logo_ids: uniqueArray}).then(res => {
            setLogoList(res.data);
            dispatch({type: commonConstants.SET_LOADING, loading: false});
        })

        const locale = i18n.language;
        const currency = i18n.language == 'ja' ? 'JPY' : (i18n.language == 'vi' ? 'VND' : 'USD');
        setFormatParams({
            currency, locale
        });
    }, []);

    useEffect(() => {
        calculateTotalAmount();
    }, [shoppingCartStore]);

    const calculateTotalAmount = () => {
        let total = 0;
        shoppingCartStore.forEach(s => {
            total += getLogoPrice();
            if (s.logoManual) total += getManualPrice();
            if (s.logoMotion) total += getMotionPrice();
        });
        setTotalAmount(total);
    }

    const showTankLater = (item: ShoppingCartTypes) => {
        const exist: any = logoList.find((el: any) => el.logo_id == item.productId)
        return !!(exist && !exist.is_like);
    }

    const showInactive = (item: ShoppingCartTypes) => {
        const exist = shoppingCartStore.find(el => el.productId == item.productId)
        return exist?.product?.inactive;
    }

    const removeProduct = (item: ShoppingCartTypes) => {
        const diff = shoppingCartStore.filter(s => s.productId !== item.productId);
        dispatch({type: userConstants.SET_SHOPPING_CART, shoppingCart: diff});
        calculateTotalAmount();
    }

    const getProductName = (item: any) => {
        const product: any = logoList.find((el: any) => el.logo_id == item.productId);
        if (product && product.logo_language) {
            return product.logo_language[i18n.language] ?? ''
        }

        return product && product.logo_name;
    }

    const getSubTotalProduct = (item: ShoppingCartTypes) => {
        let price = priceSettings.logo_price[i18n.language];
        let logoManualPrice = 0;
        let logoMotionPrice = 0;
        if (item.logoManual) {
            logoManualPrice = priceSettings.logo_manual_price[i18n.language];
        }
        if (item.logoMotion) {
            logoMotionPrice = priceSettings.logo_motion_price[i18n.language];
        }

        const total = price + logoManualPrice + logoMotionPrice;

        return t(`{{price, currency}}`, {
            price: total,
            formatParams: {
                price: formatParams
            }
        });
    }

    const getOptionManualProduct = (item: any) => {
        if (item && item.logoManual) {
            return t('+ {{price, currency}}', {
                price: priceSettings.logo_manual_price[i18n.language],
                formatParams: {
                    price: formatParams
                }
            });
        }

        return '';
    }

    const getOptionMotionProduct = (item: any) => {
        if (item && item.logoMotion) {
            return t('+ {{price, currency}}', {
                price: priceSettings.logo_motion_price[i18n.language],
                formatParams: {
                    price: formatParams
                }
            });
        }
        return '';
    }

    const proceedCheckOut = () => {
        const exist = logoList.some((item: any) => item.inactive);
        if (exist) {
            setShowMessage(true);
            setMessage(t('shopping_cart.error_product_inactive') ?? '');
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
            return;
        }
        // dispatch({ type: commonConstants.SET_LOADING, loading: true });
        if (!authentication.loggedIn) {
            dispatch({type: commonConstants.SET_OPEN_SIGN_IN, openSignInForm: true});
            return;
        }

        if (paymentMethod) {
            dispatch({
                type: commonConstants.SET_PREPARE_ORDER_DATA, prepareOrderData: {
                    paymentMethod: {id: paymentMethod.id, name: paymentMethod.short_name, active: paymentMethod.active},
                    cart: shoppingCartStore
                }
            });
            navigate(`/${i18n.language}/my-page/cart/payment`);
        } else {
            setShowMessage(true);
            setMessage(t('shopping_cart.choose_pay_method') ?? '');
            dispatch({type: commonConstants.SET_LOADING, loading: false});
            setTimeout(() => {
                setShowMessage(false);
            }, 1500);
        }
    }

    const tankLater = (item: ShoppingCartTypes) => {
        logoService.favorite(item.productId, true).then();
        dispatch({type: commonConstants.SET_FAVORITE_COUNT, favoriteCount: favoriteCount + 1});
        dispatch({
            type: userConstants.SET_SHOPPING_CART,
            shoppingCart: shoppingCartStore.filter(s => s.productId !== item.productId)
        });
    }

    const changePayMethod = (e: any) => {
        const payMethod: any = paymentMethods.find((el: any) => el.id == e.target.value)
        if (payMethod) {
            setPaymentMethod(payMethod);
        }
    }

    return <>
        <PublicHeader/>
        <div className="pt-40 lg:pt-24">
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="flex w-full justify-center">
                {loading ? (<Loading/>) : null}
                <div className="w-full flex flex-col items-center z-0 mt-8 max-w-[980px]">
                    <div className="w-full mb-3">
                        <Breadcrumb breadcrumbs={breadcrumbs}/>
                    </div>
                    <div className="w-full max-w-[980px]">
                        <div className="text-lg px-4 lg:px-0">{t('shopping_cart.title')}</div>
                        <hr className="border border-neutral-700 mt-2 mx-4 lg:mx-0"/>
                        <div className="grid col-span-1 lg:grid-cols-3 gap-4 py-8">
                            <div className="col-span-1 xs:col-span-2 mb-4 max-md:px-4 md:px-0">
                                {shoppingCartStore?.map(item => (
                                    <div key={`cart_${item.productId}`} className="w-full">
                                        <div className="grid grid-cols-1 xs:grid-cols-8 gap-4 ">
                                            <div className="xs:col-span-3 relative">
                                                <div className="flex items-center justify-center mb-4 md:pr-4">
                                                    <img className="h-44 w-44" src={item.product?.src} alt=""/>
                                                </div>
                                                {showInactive(item) ? (
                                                    <div className="absolute z-[100] opacity-70 h-full w-full top-0">
                                                        <div
                                                            className={` bg-slate-200 h-full w-full flex justify-center items-center
                                                            ${i18n.language == 'ja' ? 'text-[40px]' : 'text-[28px]'} text-red-700 font-bold`}
                                                        >
                                                            {t('headers.sold_out')}
                                                        </div>
                                                    </div>
                                                ) : null}
                                            </div>
                                            <div className="xs:col-span-5 py-4">
                                                <div className="text-base">
                                                    <span
                                                        className="mr-2">no.{item.productId.toString().padStart(5, '0')}</span>
                                                    <span>
                                                        <Link
                                                            to={`/${i18n.language}/logo/detail/${item.productId}`}
                                                            className="text-orange-600 hover:underline">
                                                            {getProductName(item)}
                                                        </Link>
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    {t('logo_detail.sub_name')}: {item.subName} / {t('logo_detail.main_name')}: {item.mainName}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm pr-2">
                                                    <div className="col-span-2">{t('shopping_cart.logo_license')}</div>
                                                    <div className="text-left lg:text-right">
                                                        {t(`{{price, currency}}`, {
                                                            price: priceSettings.logo_price[i18n.language],
                                                            formatParams: {
                                                                price: formatParams
                                                            }
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm pr-2">
                                                    <div
                                                        className="col-span-2">{t('logo_detail.logo_manual_option')}</div>
                                                    <div className="text-right">
                                                        {getOptionManualProduct(item)}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 text-sm pr-2">
                                                    <div
                                                        className="col-span-2">{t('logo_detail.motion_logo_option')}</div>
                                                    <div className="text-right">
                                                        {getOptionMotionProduct(item)}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-4 py-1 pr-2">
                                                    <div
                                                        className="col-span-2 text-sm">{t('logo_detail.total')} ({t('logo_detail.with_tax')})
                                                    </div>
                                                    <div className="text-red-600 font-[900] text-base text-left lg:text-right">
                                                        {getSubTotalProduct(item)}
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    <div
                                                        className="pr-5 ">{t('shopping_cart.quantity')}: 1</div>
                                                    <div className="px-5 border-l">
                                                        <button
                                                            onClick={() => removeProduct(item)}
                                                            type="button"
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            {t('shopping_cart.delete')}
                                                        </button>
                                                    </div>
                                                    {showTankLater(item) && !showInactive(item) ? (
                                                        <div className="px-5 border-l">
                                                            <button
                                                                onClick={() => tankLater(item)}
                                                                type="button"
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                {t('shopping_cart.tank_later')}
                                                            </button>
                                                        </div>) : null}
                                                </div>
                                            </div>
                                        </div>
                                        <br/>
                                        <hr/>
                                    </div>
                                ))}
                            </div>

                            <div className="col-span-1 flex  lg:justify-center">
                                <div>
                                    <div className="">
                                        <div
                                            className="max-lg:px-4 text-base font-bold">{t('shopping_cart.select_pay_method')}</div>
                                        <div className="p-4">
                                            {paymentMethods.map((el: any, key: number) => {
                                                if ((i18n.language === 'en' || i18n.language === 'ja') && el.id !== 1) {
                                                    return null;
                                                }
                                                return <div key={key}
                                                            className={`flex items-center mr-4 mb-4 ${!el.active ? 'opacity-50' : ''}`}>
                                                    <input
                                                        id={`radio-${key}`}
                                                        type="radio"
                                                        name="sold_out"
                                                        disabled={!el.active}
                                                        className="hidden"
                                                        value={el.id}
                                                        onChange={changePayMethod}
                                                    />
                                                    <label htmlFor={`radio-${key}`}
                                                           className="flex items-center cursor-pointer space-x-2">
                                                        <span
                                                            className={`min-w-[20px] w-5 h-5 inline-block mr-1 rounded-full border border-grey`}></span>
                                                        <div className="flex flex-wrap">
                                                            {el.icon}
                                                            {el.name}
                                                        </div>
                                                    </label>
                                                </div>
                                            })}
                                            <hr className="py-4"/>
                                            <div className="flex justify-between">
                                                <div
                                                    className="text-sm">{t('shopping_cart.subtotal')} ({t('logo_detail.with_tax')})
                                                </div>
                                                <div className="font-[900] text-red-600">
                                                    {t(`{{price,currency}}`, {
                                                        price: totalAmount,
                                                        formatParams: {
                                                            price: formatParams
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                            <div className="py-4">
                                                <button
                                                    onClick={proceedCheckOut}
                                                    type="button"
                                                    className="w-full text-white bg-orange-600 hover:bg-orange-700 focus:ring-4
                                                    focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-5
                                                    py-2.5 text-center"
                                                >
                                                    {t('shopping_cart.proceed_checkout')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <PublicMessageAddToCartModal
                open={showMessage}
                message={message}
                closeModal={setShowMessage}
                status={false}
            />
        </div>
    </>
}

export default PublicShoppingCart;
