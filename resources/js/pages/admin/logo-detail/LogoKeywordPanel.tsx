interface LogoKeywordPanelProps {
    keywords: any[];
}

export const LogoKeywordPanel = ({ keywords }: LogoKeywordPanelProps) => {
    return (
        <div className="p-2">
            {keywords.length === 0 && (
                <div className="text-sm text-gray-500">
                    キーワードはありません。
                </div>
            )}
            <div className="space-y-2">
                {keywords.map((keyword, index) => (
                    <div className="grid grid-cols-3" key={`keyword_${index}`}>
                        <div>
                            <p className="pl-2 leading-8">キーワード</p>
                        </div>
                        <div className="col-span-2">
                            <input
                                type="text"
                                className="w-full border px-2 py-1 focus:outline-none"
                                value={
                                    keyword?.keyword?.keyword_language?.ja ??
                                    keyword?.keyword?.keyword ??
                                    ""
                                }
                                disabled
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
