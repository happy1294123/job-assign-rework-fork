let timeId

export function countIdleLogout() {    
    console.log('countIdleLogout')
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
    }, 1000 * 60 * 10)
}