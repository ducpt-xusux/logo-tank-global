import { MasterDataResponseTypes, OptionSelectTypes } from "@/helper/type";
import { Listbox, Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "../Icon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/helper/store";
import { useTranslation } from "react-i18next";
import { commonConstants } from "@/constants";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"

const PublicSearchHeader = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const { i18n, t } = useTranslation('common', { useSuspense: false });
    const conditions = useSelector((state :RootState) => state.system.conditions);
    const industries = useSelector((state :RootState) => state.system.industries);
    const colors = useSelector((state :RootState) => state.system.colors);
    const tastes = useSelector((state :RootState) => state.system.tastes);
    const alphabets = useSelector((state :RootState) => state.system.alphabets);
    const keywordRecently = useSelector((state :RootState) => state.recently.keywordRecently);
    const actionSearch = useSelector((state :RootState) => state.system.doSearch);

    const [industry, setIndustry] = useState<object>({});
    const [genre, setGenre] = useState<object>({});
    const [type, setType] = useState<object>({});
    const [alphabet, setAlphabet] = useState<object>({});
    const [keyword, setKeyword] = useState<string>('');
    const [uKeyword, setUKeyword] = useState<string>('');
    const [soldOut, setSoldOut] = useState<string>('');
    const [overlay, setOverlay] = useState<boolean>(false);
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [showRecently, setShowRecently] = useState<boolean>(false);


    useEffect(() => {
        setFilter();
    }, []);

    useEffect(() => {
        if (location.pathname.includes('search')) {
            const keywordQuery = searchParams.get('keyword');
            keywordQuery && setKeyword(keywordQuery);
            conditions && conditions.keyword != undefined && setKeyword(conditions?.keyword);
        }
    }, [conditions.keyword, searchParams]);

    useEffect(() => {
        if (location.pathname.includes('search')) {
            const keywordQuery = searchParams.get('u_keyword');
            keywordQuery && setUKeyword(keywordQuery);
        }
    }, [searchParams]);

    useEffect(() => {
        setFilter();
    }, [conditions]);

    const onChangeOption = (item: OptionSelectTypes, type:string) => {
        switch (type) {
            case 'industry':
                dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, industry: item}});
                break;
            case 'genre':
                dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, genre: item}});
                break;
            case 'type':
                dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, type: item}});
                break;
            case 'alphabet':
                dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, alphabet: item}});
                break;
            default:
                break;
        }
    }

    const setFilter = () => {
        setIndustry(conditions.industry ?? {});
        setGenre(conditions.genre ?? {});
        setType(conditions.type ?? {});
        setAlphabet(conditions.alphabet ?? {});
    }

    const handleOnChangeSearch = (e: any) => {
        setKeyword(e.target.value);
        dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, keyword: e.target.value}});
    }

    const doSearch = () => {
        setKeyword(pre => pre);
        dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, u_keyword: uKeyword}});
        if(keyword) {
            dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, keyword: keyword}});
            dispatch({ type: commonConstants.SET_KEYWORD_RECENTLY, keywordRecently: [...keywordRecently.slice(-4), keyword].reverse()});
        }else{
            dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, keyword: ''}});
        }
        dispatch({ type: commonConstants.SET_ACTION_SEARCH, doSearch: !actionSearch});
        hiddenOverlay();
        if(!location.pathname.includes('/search')) {
            navigate(`/${i18n.language}/search`);
        }
    }

    const handleChangeState = (e: any) => {
        setSoldOut(e.target.value);
        dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, sold_out: e.target.value}});
    }

    const handleKeyPress = (e:any) => {
        if (e.key === 'Enter') {
            setOverlay(pre => !pre);
            setShowRecently(false);
            if(keyword) {
                dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, keyword: keyword}});
                dispatch({ type: commonConstants.SET_KEYWORD_RECENTLY, keywordRecently: [...keywordRecently.slice(-4), keyword].reverse()});
            }else{
                dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, keyword:''}});
            }
            hiddenOverlay();
            dispatch({ type: commonConstants.SET_ACTION_SEARCH, doSearch: !actionSearch});
            if(!location.pathname.includes('/search')) {
                navigate(`/${i18n.language}/search`);
            }
        }
    }

    const clearCondition = () => {
        setKeyword('');
        dispatch({ type: commonConstants.SET_CONDITION, conditions: {}});
        setFilter();
    }

    const toggleOverLay = (open: boolean, e?:any) => {
        setOverlay(!open);
        if(e) {
            setTimeout(() => {
                e.target.focus();
                e.target.select();
            }, 200);
        }
    }

    const recentlySearch = (keyword:string, close: any) => {
        setOverlay(pre => !pre);
        dispatch({ type: commonConstants.SET_CONDITION, conditions: {...conditions, keyword: keyword}});
        dispatch({ type: commonConstants.SET_KEYWORD_RECENTLY, keywordRecently: [...keywordRecently.slice(-4), keyword].reverse()});
        setKeyword(keyword);
        close();
        hiddenOverlay();
        if(!location.pathname.includes('/search')) {
            navigate(`/${i18n.language}/search`);
        }
    }

    const rmRecentlyKeyword = (key: number) => {
        const data = [...keywordRecently];
        data.splice(key, 1);
        dispatch({ type: commonConstants.SET_KEYWORD_RECENTLY, keywordRecently: data});
    }

    const hiddenOverlay = () => {
        toggleOverLay(true);
        setShowFilter(false);
        setShowRecently(false);
    }

    return <>
        <div className="flex justify-center items-center order-last lg:order-2 col-span-3 w-full py-1">
            <div className={`relative w-full xl:ml-6 lg:ml-10 lg:w-[481px] bg-slate-100 rounded-xl h-10 mt-1 ${overlay ? 'z-[11] ': ''}`}>
                <input
                    value={keyword}
                    onClick={(e) => {toggleOverLay(false, e); setShowRecently(true)}}
                    onKeyDown={(e) => {handleKeyPress(e)}}
                    onChange={handleOnChangeSearch}
                    type="text"
                    name="keyword"
                    id="keyword"
                    placeholder={`` + t('headers.search_keyword')}
                    autoComplete="off"
                    list="autoCompleteOff"
                    className={`h-10 w-full px-2 py-2 block sm:text-sm bg-transparent focus:outline-none`}
                />
                <Transition
                    show={showRecently}
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <div className="w-[240px] max-w-[240px] mt-1 overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="relative bg-white p-4 lg:grid-cols-2">
                        <div className="w-full">
                            <div className="flex justify-between pb-4">
                                <div className="mr-6 text-xs">{t('headers.recent_search_history')}</div>
                                <div onClick={() => {setOverlay(pre => !pre); setShowRecently(false)}} className="cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11.083" height="11.083" viewBox="0 0 11.083 11.083">
                                        <path id="Path_26" data-name="Path 26" d="M1921.625,3150.125,1932,3160.5" transform="translate(-1921.271 -3149.771)" fill="none" stroke="#707070" strokeWidth="1"/>
                                        <path id="Path_27" data-name="Path 27" d="M1921.625,3150.125,1932,3160.5" transform="translate(3160.854 -1921.271) rotate(90)" fill="none" stroke="#707070" strokeWidth="1"/>
                                    </svg>
                                </div>
                            </div>
                            {keywordRecently?.map((el: string, key: number) => (
                                <div key={key} className="flex items-center justify-between text-sm mb-1 hover:bg-slate-200 p-2">
                                    <div onClick={() => recentlySearch(el, close)} className="cursor-pointer w-full">{el}</div>
                                    <div onClick={() => rmRecentlyKeyword(key)} className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2" width="11.083" height="11.083" viewBox="0 0 11.083 11.083">
                                            <path id="Path_26" data-name="Path 26" d="M1921.625,3150.125,1932,3160.5" transform="translate(-1921.271 -3149.771)" fill="none" stroke="#707070" strokeWidth="1"/>
                                            <path id="Path_27" data-name="Path 27" d="M1921.625,3150.125,1932,3160.5" transform="translate(3160.854 -1921.271) rotate(90)" fill="none" stroke="#707070" strokeWidth="1"/>
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                        <div className="bg-white p-3">
                            <p className="text-[10px]">{t('headers.note_3')}</p>
                        </div>
                    </div>
                </Transition>
                <button
                    className="absolute right-10 bottom-2"
                    onClick={() => { setShowFilter(!showFilter); toggleOverLay(showFilter) }}
                >
                        ＋ {t('headers.add_filter')}
                </button>
            <div className={`flex absolute top-10 mt-1 left-0 z-10`} >
                    <Transition
                        show={showFilter}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="rounded-lg relative grid gap-8 bg-white p-4">
                                <div className="w-full">
                                    <div className="flex justify-between">
                                        <div className="flex pb-4">
                                            <div className="mr-6">{t('headers.add_filter')}</div>
                                            <div>
                                                <button
                                                    onClick={clearCondition}
                                                    type="button"
                                                    className="text-sky-500 hover:underline"
                                                >
                                                    {t('headers.clear_condition')}
                                                </button>
                                            </div>
                                        </div>
                                        <div onClick={() => {setOverlay(pre => !pre); setShowFilter(false)}} className="cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11.083" height="11.083" viewBox="0 0 11.083 11.083">
                                                <path id="Path_26" data-name="Path 26" d="M1921.625,3150.125,1932,3160.5" transform="translate(-1921.271 -3149.771)" fill="none" stroke="#707070" strokeWidth="1"/>
                                                <path id="Path_27" data-name="Path 27" d="M1921.625,3150.125,1932,3160.5" transform="translate(3160.854 -1921.271) rotate(90)" fill="none" stroke="#707070" strokeWidth="1"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex">
                                            <label htmlFor="" className="w-2/6 font-bold">{t('headers.industry')}</label>
                                            <SelectBoxGroup
                                                options={industries}
                                                value={industry}
                                                onChange={(selected: OptionSelectTypes) => onChangeOption(selected, 'industry')}
                                                className="w-4/6"
                                            />
                                        </div>
                                        <div className="flex">
                                            <label htmlFor="" className="w-2/6 font-bold">{t('headers.alphabet')}</label>
                                            <SelectBoxGroup
                                                options={alphabets}
                                                value={alphabet}
                                                onChange={(selected: OptionSelectTypes) => onChangeOption(selected, 'alphabet')}
                                                className="w-4/6"
                                            />
                                        </div>
                                        <div className="flex">
                                            <label htmlFor="" className="w-2/6 font-bold">{t('headers.genre')}</label>
                                            <SelectBoxGroup
                                                options={colors}
                                                value={genre}
                                                onChange={(selected: OptionSelectTypes) => onChangeOption(selected, 'genre')}
                                                className="w-4/6"
                                            />
                                        </div>
                                        <div className="flex">
                                            <label htmlFor="" className="w-2/6 font-bold">{t('headers.taste')}</label>
                                            <SelectBoxGroup
                                                options={tastes}
                                                value={type}
                                                onChange={(selected: OptionSelectTypes) => onChangeOption(selected, 'type')}
                                                className="w-4/6"
                                            />
                                        </div>
                                        <div className="flex">
                                            <label htmlFor="" className="w-2/6 font-bold">{t('headers.sold')}</label>
                                            <div className="flex w-4/6">
                                                <div className="flex items-center mr-4 mb-4 ">
                                                    <input id="radio1" type="radio" name="sold_out" className="hidden" value={'1'} checked={soldOut == '1'} onChange={handleChangeState}/>
                                                    <label htmlFor="radio1" className="flex items-center cursor-pointer">
                                                        <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                                        {t('headers.yes')}
                                                    </label>
                                                </div>
                                                <div className="flex items-center mr-4 mb-4">
                                                    <input id="radio2" type="radio" name="sold_out" className="hidden" value={'0'} checked={soldOut == '0'} onChange={handleChangeState}/>
                                                    <label htmlFor="radio2" className="flex items-center cursor-pointer">
                                                        <span className="w-4 h-4 inline-block mr-1 rounded-full border border-grey"></span>
                                                        {t('headers.no')}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4 text-xs'>
                                        <p>
                                            {t('headers.note')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
                <button
                    onClick={doSearch}
                    type="button"
                    className="absolute top-0 right-0 border-gray-300 px-3 !h-10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 19.408 21.408">
                        <g transform="translate(1 1)">
                            <circle id="Ellipse_1" data-name="Ellipse 1" cx="7" cy="7" r="7" fill="none" stroke="#6a6a72" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
                            <line id="Line_1" data-name="Line 1" x2="5" y2="6" transform="translate(12 13)" fill="none" stroke="#6a6a72" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2"/>
                        </g>
                    </svg>
                </button>
            </div>
        </div>
        {overlay ? <div onClick={hiddenOverlay} className="fixed inset-0 bg-black opacity-30 z-10"></div>: null}
    </>
}


const SelectBoxGroup = ({value, options, onChange, className}: {value: MasterDataResponseTypes, options: MasterDataResponseTypes[], onChange?: Function, className?: string}) => {
    const [selected, setSelected] = useState<MasterDataResponseTypes>(options[0]);
    const { i18n, t } = useTranslation('common', { useSuspense: false });

    const onChangeSelect = (item: MasterDataResponseTypes) => {
        const result = options.find(el => item.id == el.id);
        result && setSelected(result);
        onChange && onChange(item)
    }
    useEffect(() => {
        if (value) {
            const result = options.find(el => value.id == el.id)

            result ? setSelected(result) : setSelected(options[0])
        }
    },[value])

    const getOptionName = (selected: any) => {
        if(selected && selected[`name_${i18n.language}`]) {
            return selected[`name_${i18n.language}`]
        }

        return ''
    }

    return (
        <Listbox value={selected} onChange={onChangeSelect}>
            {({ open }) => (
                <div className={`relative mt-1 ${className}`}>
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate">{getOptionName(selected)}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        {open ? (<ChevronUpIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />) : (<ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>)}
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {options.map((option:any, key) => (
                                <Listbox.Option
                                key={key}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                                    }`
                                }
                                value={option}
                                >
                                {({ selected }) => (
                                    <>
                                    <span
                                        className={`block truncate ${
                                        selected ? 'font-medium' : 'font-normal'
                                        }`}
                                    >
                                        {option[`name_${i18n.language}`] ?? ""}
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
            )}
        </Listbox>
    )
}

export default PublicSearchHeader;
