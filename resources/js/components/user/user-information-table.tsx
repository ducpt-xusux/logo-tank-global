import { router } from "@inertiajs/react";
import { CircleUserRound } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type EditMode = "" | "profile" | "email" | "password";

export type UserInformation = {
    id?: number;
    name?: string | null;
    email?: string | null;
    provider?: string | null;
    company_name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    address_line_1?: string | null;
    address_line_2?: string | null;
    postal_code?: string | number | null;
    phone?: string | null;
};

type UserInformationTableProps = {
    user: UserInformation | null;
};

const inputClassName =
    "block w-full rounded-md border border-gray-300 p-2 text-neutral-600 focus:border-[#FF8D26] focus:ring-[#FF8D26] sm:text-sm";

export function UserInformationTable({ user }: UserInformationTableProps) {
    const { t } = useTranslation("common", { useSuspense: false });

    const [editMode, setEditMode] = useState<EditMode>("");
    const [email, setEmail] = useState<string>(() => user?.email ?? "");
    const [password, setPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [firstName, setFirstName] = useState<string>(
        () => user?.first_name ?? "",
    );
    const [lastName, setLastName] = useState<string>(
        () => user?.last_name ?? "",
    );
    const [companyName, setCompanyName] = useState<string>(
        () => user?.company_name ?? "",
    );
    const [addressLine1, setAddressLine1] = useState<string>(
        () => user?.address_line_1 ?? "",
    );
    const [addressLine2, setAddressLine2] = useState<string>(
        () => user?.address_line_2 ?? "",
    );
    const [postalCode, setPostalCode] = useState<string | number>(
        () => user?.postal_code ?? "",
    );
    const [phoneNumber, setPhoneNumber] = useState<string>(
        () => user?.phone ?? "",
    );

    const changeMode = (mode: EditMode) => {
        setEditMode(mode);
    };

    const handleUpdateSubmit = () => {
        if (editMode === "password" && user?.provider !== "google") {
            router.put(
                "/user/password",
                {
                    current_password: password,
                    password: newPassword,
                    password_confirmation: confirmPassword,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        changeMode("");
                        setPassword("");
                        setNewPassword("");
                        setConfirmPassword("");
                    },
                },
            );

            return;
        }

        router.put(
            "/user/profile-information",
            {
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                address_line_1: addressLine1,
                address_line_2: addressLine2,
                postal_code: postalCode,
                phone: phoneNumber,
                email,
            },
            {
                preserveScroll: true,
                onSuccess: () => changeMode(""),
            },
        );
    };

    return (
        <div className="overflow-hidden rounded-md border border-gray-300">
            <table className="w-full text-left text-sm text-[#555]">
                <tbody className="divide-y divide-gray-200">
                    <tr className="bg-white">
                        <td className="w-1/3 px-6 py-5 md:w-1/4">
                            <CircleUserRound
                                className="h-7 w-7 text-[#F03641]"
                                strokeWidth={1.5}
                            />
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "" ? (
                                <button
                                    onClick={() => changeMode("profile")}
                                    type="button"
                                    className="cursor-pointer text-[#0088CC] transition-colors hover:text-[#006699]"
                                >
                                    {t(
                                        "user_information.change_profile",
                                        "Change Profile",
                                    )}
                                </button>
                            ) : (
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleUpdateSubmit}
                                        type="submit"
                                        className="bg-brand h-full w-24 rounded-lg px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-[#E67E00] focus:ring-0 focus:outline-none"
                                    >
                                        {t("user_information.save", "Save")}
                                    </button>
                                </div>
                            )}
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t("user_information.customer_no", "Customer no.")}
                        </td>
                        <td className="px-6 py-5">{user?.id || "131"}</td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t("user_information.mail", "Mail")}
                        </td>
                        <td className="flex flex-col items-start gap-2 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            {editMode === "email" ? (
                                <div className="w-full">
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        className={inputClassName}
                                        placeholder="Email"
                                    />
                                </div>
                            ) : (
                                <span>{user?.email || ""}</span>
                            )}
                            <div className="mt-2 text-[#0088CC] sm:mt-0">
                                {editMode === "email" ||
                                editMode === "password" ? null : (
                                    <>
                                        {!user?.provider && (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        changeMode("email")
                                                    }
                                                    type="button"
                                                    className="transition-colors hover:text-[#006699]"
                                                >
                                                    {t(
                                                        "user_information.change_email",
                                                        "Change Email",
                                                    )}
                                                </button>
                                                <span className="mx-1 text-[#555]">
                                                    /
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        changeMode("password")
                                                    }
                                                    type="button"
                                                    className="transition-colors hover:text-[#006699]"
                                                >
                                                    {t(
                                                        "user_information.change_password",
                                                        "Change Password",
                                                    )}
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                    {editMode === "password" && (
                        <tr className="bg-white">
                            <td className="px-6 py-5">
                                {t("user_information.password", "Password")}
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col gap-3">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        className={`${inputClassName} md:w-1/2`}
                                        placeholder="Current password"
                                    />
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(event) =>
                                            setNewPassword(event.target.value)
                                        }
                                        className={`${inputClassName} md:w-1/2`}
                                        placeholder="New password"
                                    />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(event) =>
                                            setConfirmPassword(
                                                event.target.value,
                                            )
                                        }
                                        className={`${inputClassName} md:w-1/2`}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </td>
                        </tr>
                    )}
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t(
                                "user_information.company_name",
                                "Company Name",
                            )}
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "profile" ? (
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(event) =>
                                        setCompanyName(event.target.value)
                                    }
                                    className={`${inputClassName} md:w-1/2`}
                                    placeholder="Company name"
                                />
                            ) : (
                                user?.company_name || ""
                            )}
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t("user_information.full_name", "Full Name")}
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "profile" ? (
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(event) =>
                                            setFirstName(event.target.value)
                                        }
                                        className={`${inputClassName} sm:w-1/2`}
                                        placeholder="First name"
                                    />
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(event) =>
                                            setLastName(event.target.value)
                                        }
                                        className={`${inputClassName} sm:w-1/2`}
                                        placeholder="Last name"
                                    />
                                </div>
                            ) : (
                                user?.name || ""
                            )}
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t(
                                "user_information.address_1",
                                "Address Line 1",
                            )}
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "profile" ? (
                                <input
                                    type="text"
                                    value={addressLine1}
                                    onChange={(event) =>
                                        setAddressLine1(event.target.value)
                                    }
                                    className={inputClassName}
                                />
                            ) : (
                                user?.address_line_1 || ""
                            )}
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t(
                                "user_information.address_2",
                                "Address Line 2",
                            )}
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "profile" ? (
                                <input
                                    type="text"
                                    value={addressLine2}
                                    onChange={(event) =>
                                        setAddressLine2(event.target.value)
                                    }
                                    className={inputClassName}
                                />
                            ) : (
                                user?.address_line_2 || ""
                            )}
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t(
                                "user_information.postal_code",
                                "Postal Code",
                            )}
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "profile" ? (
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(event) =>
                                        setPostalCode(event.target.value)
                                    }
                                    className={`${inputClassName} md:w-1/2`}
                                />
                            ) : (
                                user?.postal_code || ""
                            )}
                        </td>
                    </tr>
                    <tr className="bg-white">
                        <td className="px-6 py-5">
                            {t(
                                "user_information.phone_number",
                                "Phone Number",
                            )}
                        </td>
                        <td className="px-6 py-5">
                            {editMode === "profile" ? (
                                <input
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(event) =>
                                        setPhoneNumber(event.target.value)
                                    }
                                    className={`${inputClassName} md:w-1/2`}
                                />
                            ) : (
                                user?.phone || ""
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
