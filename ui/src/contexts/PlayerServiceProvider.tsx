import { createContext, PropsWithChildren, useContext, useState } from "react";
import { User } from "../server/models";

type UserContextType = {
    me: User | undefined;
    setMe: (player: User) => void;
}

const PlayerContext = createContext<UserContextType>({me: undefined, setMe: () => {}});

export const PlayerProvider = ({children}: PropsWithChildren) => {
    const [me, setMe] = useState<User | undefined>(undefined);

    return (
        <PlayerContext.Provider value={{me, setMe}}>
            {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => useContext(PlayerContext);

