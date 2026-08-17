// import React, { useEffect, useRef, useState } from "react";
// import { Head, useForm } from "@inertiajs/react";
// import { Field, Post } from "@/types";
// import { FormEventHandler } from "react";
// import {
//     FormField,
//     AdminLayout,
//     Card,
//     CardHeader,
//     CardContent,
//     CardTitle,
//     Label,
//     Button,
//     ImageWithLoading,
//     ImageCropper,
//     notify,
// } from "@/components";
// import { CameraIcon, LoaderCircle } from "lucide-react";
// import { getPostStatusOptions, goBack, objectToFormData } from "@/lib/utils";

// const breadcrumbs = [
//     {
//         title: "投稿",
//         href: route("admin.post.index"),
//     },
// ];

// interface PostFormProps {
//     item: Post;
// }

// const basicFields: Field[] = [
//     {
//         name: "title",
//         label: "タイトル",
//     },
//     {
//         name: "slug",
//         label: "スラッグ",
//     },
//     {
//         name: "status",
//         label: "表示状態",
//         type: "select",
//         options: getPostStatusOptions(),
//     },
//     {
//         name: "date",
//         label: "公開日時",
//         type: "date",
//     },
//     {
//         name: "priority",
//         label: "優先度",
//         type: "number",
//     },
//     {
//         name: "image",
//         label: "画像",
//         type: "image",
//     },
//     {
//         name: "content",
//         label: "内容",
//         type: "editor",
//     },
// ];

// export default function PostForm({ item }: PostFormProps) {
//     const trigger = useRef<HTMLInputElement>(null);
//     const [picture, setPicture] = useState(item?.image ?? "");

//     const { data, setData, put, errors, processing, post } = useForm<
//         Required<Post>
//     >({
//         ...item,
//         _method: item ? "patch" : "post",
//     });

//     const submit: FormEventHandler = (e) => {
//         e.preventDefault();

//         if (item) {
//             post(route("admin.post.update", { post: item }), {
//                 forceFormData: true,
//                 onSuccess: () => {
//                     notify.success("更新完了しました。");
//                 },
//             });
//         } else {
//             post(route("admin.post.store"), {
//                 forceFormData: true,
//                 preserveScroll: true,
//             });
//         }
//     };

//     const handleInputFile = (file: any) => {
//         let reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onloadend = function () {
//             setPicture(reader.result as string);
//         };
//         // setData('picture', file);
//     };

//     return (
//         <AdminLayout breadcrumbs={breadcrumbs}>
//             <Head title="投稿" />
//             <div className="flex-1 flex-col space-y-4 p-2 sm:px-6 sm:pt-5 sm:pb-10 md:flex">
//                 <form onSubmit={submit} className="flex items-start gap-5">
//                     <Card className="w-full max-w-5xl">
//                         <CardHeader>
//                             <CardTitle>投稿情報</CardTitle>
//                         </CardHeader>
//                         <CardContent className="grid gap-6">
//                             {basicFields.map((field) => {
//                                 if (field.name === "image") {
//                                     return (
//                                         <div
//                                             className="grid gap-2"
//                                             key={field.name}
//                                         >
//                                             <Label htmlFor="picture">
//                                                 画像
//                                             </Label>
//                                             {picture ? (
//                                                 <div className="w-40">
//                                                     <ImageWithLoading
//                                                         noRatio={true}
//                                                         src={picture}
//                                                     />
//                                                 </div>
//                                             ) : (
//                                                 <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 p-2">
//                                                     <CameraIcon className="h-full w-full text-gray-300" />
//                                                 </span>
//                                             )}
//                                             <Button
//                                                 id="picture"
//                                                 className="w-40 cursor-pointer"
//                                                 onClick={() =>
//                                                     trigger.current?.click()
//                                                 }
//                                                 type="button"
//                                             >
//                                                 画像を選択する
//                                             </Button>
//                                         </div>
//                                     );
//                                 }

//                                 return (
//                                     <FormField
//                                         field={field}
//                                         data={data}
//                                         setData={setData}
//                                         errors={errors}
//                                         key={field.name}
//                                     />
//                                 );
//                             })}
//                         </CardContent>
//                     </Card>
//                     <div className="sticky top-5 flex flex-col gap-3">
//                         <Button
//                             size="lg"
//                             className="flex w-40 items-center justify-center font-bold"
//                             type="submit"
//                         >
//                             {processing ? (
//                                 <LoaderCircle className="animate-spin" />
//                             ) : (
//                                 "保存"
//                             )}
//                         </Button>

//                         <Button
//                             variant="outline"
//                             className="w-40"
//                             type="button"
//                             onClick={goBack}
//                         >
//                             前のページに戻る
//                         </Button>
//                     </div>
//                 </form>
//             </div>
//             <ImageCropper
//                 inputRef={trigger}
//                 resultImage={handleInputFile}
//                 aspectRatio={1}
//                 autoCropArea={1}
//             />
//         </AdminLayout>
//     );
// }
