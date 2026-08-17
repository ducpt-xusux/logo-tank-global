import { useEffect, useState } from "react";
import { Breadcrumb, PublicHeader, QRIcon, Loading, ConfirmModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RootState } from "@/helper/store";
import { orderService, userService } from "@/services";
import { commonConstants, userConstants } from "@/constants";
import MainLayout from "../Common/MainLayout";
import { Disclosure } from "@headlessui/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/User/CheckoutForm";
import {cn} from "@/helper/utils";
// @ts-ignore
const URLQR = `${vietQRUri}?accountName=${accountName}`;

// @ts-ignore
const stripePromise = loadStripe(stripePublicKey);

const PublicPayment = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [locale, setLocale] = useState('en');
    const order = useSelector((state: RootState) => state.system.order);
    const { pathname } = useLocation();
    const [clientSecret, setClientSecret] = useState("");
    const availableLocales = ['en', 'ja', 'vi'];
    const pathnameLocale = pathname.substring(1, 3).toLowerCase();
    const { i18n, t } = useTranslation('common', { useSuspense: false });
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [tax, setTax] = useState<number>(0);
    const priceSettings = useSelector((state: RootState) => state.system.priceSettings);
    const user = useSelector((state: RootState) => state.authentication.user);
    const prepareOrderData = useSelector((state: RootState) => state.system.prepareOrderData);
    const [paymentMethodSelected, setPaymentMethodSelected] = useState<number>(
        prepareOrderData.paymentMethod ? prepareOrderData.paymentMethod.id : 0);
    const shoppingCart = useSelector((state: RootState) => state.system.shoppingCart);
    const [formatParams, setFormatParams] = useState<Object>({});
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const loading = useSelector((state: RootState) => state.system.loading);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<number>(0);

    const paymentMethods =[
        {
            id: 2,
            name: <div className="flex items-center ml-2">QR Scan</div>,
            icon: <QRIcon className="h-9 w-9"/>,
            children: <div className="flex justify-center">
                <div className="w-96">
                    <img
                        src={`${URLQR}&amount=${totalAmount}&addInfo=Thanh Toan Logo id: `+
                            `${prepareOrderData?.cart?.map((u:any) => u?.logo_id).join(' ') }`}
                        alt=""
                    />
                </div>
            </div>,
            active: true
        },
        {
            id: 3,
            name: <div className="flex items-center ml-2">mono</div>,
            icon: <img className="h-9 w-9" src="/img/logo-momo.png" alt="" />,
            children: '',
            active: false
        },
        {
            id: 4,
            name: <div className="flex items-center ml-2">ZaloPay</div>,
            icon: <img className="h-9 w-9" src="/img/logo-zalopay.png" alt="" />,
            children: '',
            active: false
        },
    ];

    const breadcrumbs = [
        {
            name: t('breadcrumbs.home'),
            path: '/'
        },
        {
            name: t('shopping_cart.title'),
            path: `/${locale}/my-page/cart`
        },
        {
            name: t('shopping_cart.select_pay_method'),
            path: null
        },
    ];

    useEffect(()=> {
        const locale = i18n.language;
        const currency = i18n.language == 'ja' ? 'JPY': (i18n.language == 'vi'? 'VND': 'USD');
        setFormatParams({
            currency,locale
        });
        calculateAmount();
    }, []);

    useEffect(() => {
        if (availableLocales.includes(pathnameLocale)) {
            setLocale(pathnameLocale);
        } else {
            setLocale('en');
        }
    }, [pathname]);


    useEffect(() => {
        dispatch({ type: commonConstants.SET_LOADING, loading: true });
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
        const currency = i18n.language == 'ja' ? 'JPY': (i18n.language == 'vi'? 'VND': 'USD');
        const paymentIntent = searchParams.get('payment_intent');
        const client_secret = searchParams.get('payment_intent_client_secret');
        if (!paymentIntent && prepareOrderData.paymentMethod.id == 1 && totalAmount) {
            userService.createPayIntent({ amount: totalAmount, currency: currency.toLocaleLowerCase()}).then(res => {
                setClientSecret(res.data.client_secret);
                dispatch({ type: commonConstants.SET_LOADING, loading: false });
            }).catch(err => {
                dispatch({ type: commonConstants.SET_LOADING, loading: false });
                console.error('err', err);
            })
        }else {
            dispatch({ type: commonConstants.SET_LOADING, loading: false });
        }

        if(client_secret) {
            setClientSecret(client_secret);
            setPaymentMethodSelected(1);
        }
    }, [totalAmount])

    const calculateAmount = () => {
        let total = 0;
        let taxPrice = 0;
        const taxRate = priceSettings.tax[i18n.language] || 10;

        prepareOrderData.cart.forEach((item) => {
            total += priceSettings.logo_price[i18n.language];
            if (item.logoManual) {
                total += priceSettings.logo_manual_price[i18n.language];
            }
            if (item.logoMotion) {
                total += priceSettings.logo_motion_price[i18n.language];
            }
        });
        taxPrice += total * (taxRate/(100 + taxRate))
        setTax(taxPrice);
        setTotalAmount(total);
    }

    const confirmPaid = async () => {
        await orderService.createOrderQA({
            products: prepareOrderData.cart,
            status: 2,
            amount:totalAmount,
            lang: i18n.language,
            payment_method_id: prepareOrderData.paymentMethod.id
        })
        dispatch({ type: commonConstants.SET_LOADING, loading: true });
        dispatch({ type: userConstants.SET_SHOPPING_CART, shoppingCart: [] });
        dispatch({ type: commonConstants.SET_PREPARE_ORDER_DATA, prepareOrderData: {} });
        dispatch({ type: commonConstants.SET_ORDER, prepareOrderData: {} });
        dispatch({ type: commonConstants.SET_LOADING, loading: false });
        dispatch({ type: commonConstants.SET_TOTAL_AMOUNT, totalAmount: totalAmount});
        navigate(`/${i18n.language}/my-page/payment-complete`);
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        switch (paymentMethodSelected) {
            case 1:
                setTrigger((pre: number) => pre + 1);
                break;
            case 2:
                setShowConfirm(true);
                break;
            default:
                break;
        }
    };

    return <>
        <PublicHeader />
        <MainLayout>
            <div className="flex w-full justify-center overflow-hidden">
                <div
                    className={cn(
                        `w-full flex flex-col items-center z-0 pl-9 pr-9 py-2 max-w-[1280px] mx-auto`,
                        i18n.language == 'vi' ? 'mt-6' : 'mt-0'
                    )}
                >
                    <div className="w-full mb-3">
                        <Breadcrumb breadcrumbs={breadcrumbs}/>
                    </div>
                    <form id="payment-form" onSubmit={handleSubmit} className="w-full">
                        <div className="flex flex-wrap w-full">
                            <div className="md:w-6/12 w-full px-4 pt-8 md:pt-16">
                                {loading ? (<Loading />) : null }
                                <div>
                                    <div className="flex">
                                        <div className="font-bold ">{t('shopping_cart.billing_address')}</div>
                                        <div className="pl-0.5 md:pl-4">
                                            <Link to={`/${i18n.language}/my-page/profile`}>
                                                <button
                                                    type="button"
                                                    className="border h-7 px-3 text-gray-300 rounded-lg bg-white hover:bg-gray-200
                                                    focus:outline-none focus:ring-0 font-medium text-sm text-center"
                                                >
                                                    {t('shopping_cart.change')}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-7">
                                        <div className="font-bold">
                                            {(user?.detail.company_name ? user?.detail.company_name + ' | ' : '' ) } {user?.detail.name}
                                        </div>
                                        <div className="text-gray-300">{user?.detail.address_line_1}</div>
                                    </div>
                                </div>
                                <hr className="border" />
                                <br />
                                <div>
                                    <div className="flex">
                                        <div className="font-bold">{t('shopping_cart.payment')}</div>
                                        <div className="ml-5">
                                            <Link to={`/${i18n.language}/my-page/cart`}>
                                                <button
                                                    type="button"
                                                    className="border h-7 px-3 text-gray-300 rounded-lg bg-white hover:bg-gray-200
                                                    focus:outline-none focus:ring-0 font-medium text-sm text-center"
                                                >
                                                    {t('shopping_cart.change')}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className={` mx-auto w-full rounded-lg border
                                    ${ paymentMethodSelected == 1 ? `border-orange-600 bg-[#FFF9F5] `: 'border-gray-300 bg-white'} m-1`}>
                                        <Disclosure defaultOpen={paymentMethodSelected == 1}>
                                            <Disclosure.Button
                                                className="flex w-full justify-between rounded-lg text-left text-sm
                                                font-medium text-purple-900 focus:outline-none focus-visible:ring
                                                focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                                            >
                                                <div className="w-full px-4 py-4" onClick={() => setPaymentMethodSelected(1)} >
                                                    <div className="flex items-center">
                                                        <div>
                                                            <img className="h-9" src="/img/credit-card.png" alt="credit-card"/>
                                                        </div>
                                                        <div>
                                                            <div className="w-full flex items-center">
                                                                <div>Credit Card</div>
                                                                <div className="text-sm font-light ml-1">(with Stripe)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Disclosure.Button>
                                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                {clientSecret ? (
                                                    <Elements
                                                        options={{clientSecret: clientSecret, appearance: {theme: 'stripe'}}}
                                                        stripe={stripePromise}
                                                    >
                                                        <CheckoutForm trigger={trigger} order={order} setTrigger={setTrigger}/>
                                                    </Elements>
                                                ) : null}
                                            </Disclosure.Panel>
                                        </Disclosure>
                                    </div>
                                    {!loading && paymentMethods.length && paymentMethods.map((item: any, key: number) => {
                                        if (i18n.language !== 'vi') return null;
                                        return (
                                        <div
                                            key={key}
                                            className={`${!item.active ? 'opacity-60' : ''} mx-auto w-full rounded-lg border
                                            ${ paymentMethodSelected == item.id ?
                                                `border-orange-600 bg-[#FFF9F5] `: 'border-gray-300 bg-white'
                                            } m-1`}>
                                            <Disclosure defaultOpen={paymentMethodSelected == item.id}>
                                                <Disclosure.Button
                                                    className={cn(
                                                        "flex w-full justify-between rounded-lg text-left text-sm",
                                                        'font-medium text-purple-900 focus:outline-none focus-visible:ring',
                                                        'focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
                                                    )}
                                                >
                                                    <div
                                                        className="w-full px-4 py-4"
                                                        onClick={() => item.active ? setPaymentMethodSelected(item.id) : null}
                                                    >
                                                        <div className="flex items-center">
                                                            <div>
                                                                {item.icon}
                                                            </div>
                                                            <div>
                                                                {item.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Disclosure.Button>
                                                {item.active ? (
                                                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                                                        {item.children}
                                                    </Disclosure.Panel>
                                                ) : null}
                                            </Disclosure>
                                        </div>
                                    )})}
                                </div>
                                <br />
                                <hr className="border" />
                                <br />
                                <div>
                                    <div className="flex">
                                        <div className="font-bold">{t('shopping_cart.shipping')}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 p-7">
                                        {t('shopping_cart.no_shipping')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-6/12 w-full px-4 pt-4 max-sm:mt-5 md:pt-16">
                                <div className="text-lg font-bold">{t('shopping_cart.order_summary')}</div>
                                <br />
                                <div className="w-full flex">
                                    <div className="w-2/3">
                                        <div>{t('shopping_cart.subtotal_with_tax')}</div>
                                        <div>{t('shopping_cart.tax')}({priceSettings.tax[i18n.language] || 10}%)</div>
                                        <div>{t('shopping_cart.shipping')}</div>
                                        <hr className="my-4"/>
                                        <div>{t('shopping_cart.total_with_tax')}</div>
                                    </div>
                                    <div className="w-1/3">
                                        <div className="font-bold text-right">{t(`{{price, currency}}`, {
                                                price: totalAmount - tax,
                                                formatParams: {
                                                    price: formatParams
                                                }
                                            })}</div>
                                        <div className="font-bold text-right">{t(`{{price, currency}}`, {
                                                price: tax,
                                                formatParams: {
                                                    price: formatParams
                                                }
                                            })}</div>
                                        <div className="font-bold text-right">{t(`{{price, currency}}`, {
                                                price: 0,
                                                formatParams: {
                                                    price: formatParams
                                                }
                                            })}</div>
                                        <hr className="my-4"/>
                                        <div
                                            className="font-[900] text-right text-red-600"
                                            id="total_amount"
                                        >
                                            {t(`{{price, currency}}`, {
                                                price: totalAmount,
                                                formatParams: {
                                                    price: formatParams
                                                }
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    id="submit"
                                    className="w-full mt-4 text-white rounded bg-orange-600 hover:bg-orange-700 focus:outline-none
                                    focus:ring-0 font-medium text-sm px-5 py-2.5 text-center"
                                >
                                    <span id="button-text">
                                        {t('shopping_cart.completed_order')}
                                    </span>
                                </button>
                            </div>
                        </div>
                        <ConfirmModal
                            message={t('shopping_cart.confirm_pay')}
                            open={showConfirm}
                            closeModal={() => setShowConfirm(false)}
                            process={confirmPaid}
                        />
                    </form>
                </div>
            </div>
        </MainLayout>
    </>
}

export default PublicPayment;
