import { createContext, PropsWithChildren, useContext, useState } from "react";
import { User } from "../server/models";

type AuthContextType = {
    me: User | undefined;
    setMe: (player: User) => void;
}

const AuthContext = createContext<AuthContextType>({me: undefined, setMe: () => {}});

export const AuthProvider = ({children}: PropsWithChildren) => {
    const [me, setMe] = useState<User | undefined>(undefined);

    return (
        <AuthContext.Provider value={{me, setMe}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);

