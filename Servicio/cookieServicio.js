export class ServicioCookie {
    constructor() { }

    setCookie(name, value, days) {
        const expirationDate = new Date();
        expirationDate.setTime(expirationDate.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + expirationDate.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=http://localhost:3000/api/";
    }

    getCookie(name) {
        const cookieName = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const cookieArray = decodedCookie.split(';');

        for (let i = 0; i < cookieArray.length; i++) {
            let cookie = cookieArray[i];
            while(cookie.charAt(0) === ' '){
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(cookieName) === 0) {
                return cookie.substring(cookieName.length);
            }
        }

        return null;
    }

    deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    decodeJwt(token){
        const tokenParts = token.split('.');
        var decodedPayload = null;

        if (tokenParts.length === 3) {
            const payload = tokenParts[1];
            decodedPayload = atob(payload);
        }

        return JSON.parse(decodedPayload);
    }
}