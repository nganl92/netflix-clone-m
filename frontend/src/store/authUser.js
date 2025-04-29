import axios from 'axios'
import toast from 'react-hot-toast'
import {create} from 'zustand'

export const useAuthStore = create((set) => ({
    user:null,
    isSigningUp:false,
    isCheckingAuth: false,
    isLogginOut: false,
    isLogginIn: false,
    signup: async (credentials) => {
        set({isSigningUp:true})
        try {
            const response = await axios.post('/api/v1/auth/signup', credentials)
            set({user:response.data.user, isSigningUp:false,})
            toast.success("Account created successfuly")
            
        } catch (error) {
            toast.error(error.response.data.message || "Signup failed")
            set({isSigningUp:false, user:null})
        }
    },
    login:async (credentials) => {
        set({isLogginIn : true})
        try {
            const response = await axios.post('/api/v1/auth/login', credentials)
            set({user:response.data.user, isSigningUp:false,})
            toast.success("Login successfuly")
        } catch (error) {
            toast.error(error.response.data.message || "Login failed")
            set({isSigningUp:false, user:null})
        }
    },
    logout:async () => {
        set({isLogginOut:true})
        try {
            const response = await axios.post('/api/v1/auth/logout')
            set({user:null, isLogginOut:false,})
            toast.success("Loged out successfully")

        } catch (error) {
            set({isLogginOut:false, user:null})
            toast.error(error.response.data.message || "Logout failed")
        }
    },
    authCheck:async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get('/api/v1/auth/authCheck')
            set({user: response.data.user, isCheckingAuth: false})
        } catch (error) {
            set({ isCheckingAuth: false, user:null});
            // toast.error(error.response.data.message  || "AuthCheck failed")
        }
    },
}))