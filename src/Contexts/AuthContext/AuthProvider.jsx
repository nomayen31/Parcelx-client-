import React from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({children}) => {

    const authInfo = {

    }
    return (
        <AuthContext value=''>
                {children}
        </AuthContext>
    );
};

export default AuthProvider;