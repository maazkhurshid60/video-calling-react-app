import React, { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client'
import { webSocketUrl } from '../utils/constants';

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = (props) => {

    const socket = useMemo(() => io(webSocketUrl), []);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}