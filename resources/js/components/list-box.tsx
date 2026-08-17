import {
    Listbox,
    Transition,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { Fragment } from "react";
import { ListBoxOption } from "@/helper/type";

interface ListBoxProps {
    options: ListBoxOption[];
    value: string | number;
    handleOnchange: any;
    disabled?: boolean;
    className?: string;
    small?: boolean;
    position?: string;
    tooltip?: boolean;
}

export const ListBox = ({
    options,
    value,
    handleOnchange,
    disabled,
    className,
    small,
    position,
    tooltip,
}: ListBoxProps) => {
    let selectedOption = options.find((item) => {
        if (value === undefined || value === null) return false;

        const val1 = String(item.value).trim();
        const val2 = String(value).trim();

        return val1 === val2;
    });

    if (!selectedOption && options.length > 0) {
        selectedOption = options[0];
    }
    const selectedValue = selectedOption?.value ?? "";
    const getOptionsClass = () => {
        let className = "";
        if (position === "top") {
            className = small ? " bottom-8" : " bottom-10";
        }
        return (
            "absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 " +
            "ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50" +
            className
        );
    };
    return (
        <Listbox
            value={selectedValue}
            onChange={(optionValue: string | number) => {
                handleOnchange(optionValue);
            }}
            disabled={disabled ? disabled : false}
        >
            <div className={"relative " + (className ?? "")}>
                <ListboxButton
                    className={
                        `relative w-full ${
                            small
                                ? "py-1 pl-2 rounded border"
                                : "py-2 pl-3 rounded-lg shadow-md"
                        } pr-10 text-left bg-white ` +
                        `focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 ` +
                        `disabled:bg-gray-100 disabled:cursor-not-allowed ` +
                        `focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 ` +
                        `focus-visible:border-indigo-500 sm:text-sm cursor-pointer`
                    }
                >
                    <span className="block truncate">
                        {selectedOption?.name ?? ""}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronsUpDown
                            className="w-5 h-5 text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </ListboxButton>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ListboxOptions className={getOptionsClass()}>
                        {options.map((option) => (
                            <ListboxOption
                                key={option.id}
                                value={option.value}
                                className={({ focus }) =>
                                    `${
                                        focus
                                            ? "text-indigo-900 bg-indigo-100"
                                            : "text-gray-900"
                                    } ` +
                                    `cursor-pointer select-none relative py-2 ${
                                        small ? "pl-6" : "pl-10"
                                    } pr-4`
                                }
                                title={tooltip ? option.name : ""}
                                disabled={option.disable ?? false}
                            >
                                {({ selected, focus }) => (
                                    <>
                                        <span
                                            className={`${
                                                selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                            } ${
                                                option.disable
                                                    ? "opacity-75 cursor-not-allowed"
                                                    : ""
                                            } block truncate`}
                                        >
                                            {option.name}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={
                                                    `${
                                                        focus
                                                            ? "text-indigo-600"
                                                            : "text-indigo-600"
                                                    } ` +
                                                    `absolute inset-y-0 left-0 flex items-center ${
                                                        small
                                                            ? "pl-0.5"
                                                            : "pl-3"
                                                    }`
                                                }
                                            >
                                                <Check
                                                    className="w-5 h-5"
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </Transition>
            </div>
        </Listbox>
    );
};

interface RadioOptionProps {
    options: ListBoxOption[];
    value: string | number;
    handleOnchange: (value: any) => void;
    name: string;
    className?: string;
    canClear?: boolean;
}

export const RadioOptions = ({
    options,
    value,
    handleOnchange,
    name,
    className,
    canClear,
}: RadioOptionProps) => {
    const handleClick = (
        e: React.MouseEvent<HTMLInputElement, MouseEvent>,
        option: ListBoxOption
    ) => {
        if (value == option.value && canClear) handleOnchange(0);
    };

    return (
        <div className={className ?? "flex"}>
            {options.map((option) => (
                <div className="flex items-center" key={option.id}>
                    <input
                        type="radio"
                        value={option.value}
                        id={`${name}_${option.value}`}
                        className="ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 cursor-pointer"
                        onChange={() => handleOnchange(option.value)}
                        name={name}
                        onClick={(e) => handleClick(e, option)}
                        defaultChecked={value === option.value}
                        ref={(input) => {
                            if (input && canClear) {
                                input.checked = value === option.value;
                            }
                        }}
                    />
                    <label
                        htmlFor={`${name}_${option.value}`}
                        className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        {option.name}
                    </label>
                </div>
            ))}
        </div>
    );
};
