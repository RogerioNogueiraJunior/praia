export function requireAuth(redirectUrl = '/login') {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = redirectUrl;
    }
}