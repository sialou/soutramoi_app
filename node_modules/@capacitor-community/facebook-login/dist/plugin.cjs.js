'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const FacebookLogin = core.registerPlugin('FacebookLogin', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.FacebookLoginWeb()),
});

class FacebookLoginWeb extends core.WebPlugin {
    constructor() {
        super({
            name: 'FacebookLogin',
            platforms: ['web'],
        });
    }
    initialize(options) {
        const defaultOptions = { version: 'v10.0' };
        return new Promise((resolve, reject) => {
            try {
                return this.loadScript(options.locale).then(() => {
                    FB.init(Object.assign(Object.assign({}, defaultOptions), options));
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    loadScript(locale) {
        if (typeof document === 'undefined') {
            return Promise.resolve();
        }
        const scriptId = 'fb';
        const scriptEl = document === null || document === void 0 ? void 0 : document.getElementById(scriptId);
        if (scriptEl) {
            return Promise.resolve();
        }
        const head = document.getElementsByTagName('head')[0];
        const script = document.createElement('script');
        return new Promise(resolve => {
            script.defer = true;
            script.async = true;
            script.id = scriptId;
            script.onload = () => {
                resolve();
            };
            script.src = `https://connect.facebook.net/${locale !== null && locale !== void 0 ? locale : 'en_US'}/sdk.js`;
            head.appendChild(script);
        });
    }
    async login(options) {
        console.log('FacebookLoginWeb.login', options);
        return new Promise((resolve, reject) => {
            FB.login(response => {
                console.debug('FB.login', response);
                if (response.status === 'connected') {
                    resolve({
                        accessToken: {
                            token: response.authResponse.accessToken,
                        },
                    });
                }
                else {
                    reject({
                        accessToken: {
                            token: null,
                        },
                    });
                }
            }, { scope: options.permissions.join(',') });
        });
    }
    async logout() {
        return new Promise(resolve => {
            FB.logout(() => resolve());
        });
    }
    async reauthorize() {
        return new Promise(resolve => {
            FB.reauthorize(it => resolve(it));
        });
    }
    async getCurrentAccessToken() {
        return new Promise((resolve, reject) => {
            FB.getLoginStatus(response => {
                if (response.status === 'connected') {
                    const result = {
                        accessToken: {
                            applicationId: undefined,
                            declinedPermissions: [],
                            expires: undefined,
                            isExpired: undefined,
                            lastRefresh: undefined,
                            permissions: [],
                            token: response.authResponse.accessToken,
                            userId: response.authResponse.userID,
                        },
                    };
                    resolve(result);
                }
                else {
                    reject({
                        accessToken: {
                            token: null,
                        },
                    });
                }
            });
        });
    }
    async getProfile(options) {
        const fields = options.fields.join(',');
        return new Promise((resolve, reject) => {
            FB.api('/me', { fields }, response => {
                if (response.error) {
                    reject(response.error.message);
                    return;
                }
                resolve(response);
            });
        });
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FacebookLoginWeb: FacebookLoginWeb
});

exports.FacebookLogin = FacebookLogin;
//# sourceMappingURL=plugin.cjs.js.map
