let timeId

export function countIdleLogout() {    
    document.addEventListener('mousemove', resetTime)
}

export function removeCountIdleLogout() {
    document.removeEventListener('mousemove', resetTime)
}

function resetTime() {
    clearTimeout(timeId)
    timeId = setTimeout(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('adminId')
        location.href = '/admin'
    }, 600000)
}