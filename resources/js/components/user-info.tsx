import { Avatar, AvatarFallback, AvatarImage } from '@/components';
import { useInitials } from '@/hooks/use-initials';

type UserInfoModel = {
    name: string;
    email: string;
    avatar: string | null;
};

export function UserInfo({ user, showEmail = false }: { user: UserInfoModel; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
