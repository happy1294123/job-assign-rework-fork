export default function getToken() {
    const token = localStorage.getItem('token')
    const adminId = localStorage.getItem('adminId')
    if (!token) {
        alert('請重新登入')
        location.href = adminId ? '/admin' : '/login'
        return
    }
    return token
}

