import api from './api';
import {route} from "ziggy-js";

export const authService = {
    async confirmPassword(params: {}) {
        return api.post(route('password.confirm.store'), params)
    },
    async enable2FA() {
        return api.post(route('two-factor.enable'), {});
    },
    async disable2FA() {
        return api.delete(route('two-factor.disable'));
    },
    async getQRCode() {
        return api.get(route('two-factor.qr-code'))
    },
    async confirmedTwoFactorAuthentication(params: {}) {
        return api.post(route('two-factor.confirm'), params)
    },
    async confirmEmailTwoFactorAuthentication(params: {}) {
        return api.post(route('two-factor-email.confirm'), params)
    },
    sendEmailTwoFactorAuthentication(params: {}) {
        return api.post(route('two-factor-email.send'), params)
    }
}
