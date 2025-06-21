const decodeJWTWithWebAPI = (token: string) => {
    try {
        const parts = token.split('.')
        const payload = parts[1]
        
        // Use TextDecoder for better Unicode support
        const decoder = new TextDecoder()
        const decodedBytes = Uint8Array.from(atob(payload), c => c.charCodeAt(0))
        const decodedString = decoder.decode(decodedBytes)
        
        return JSON.parse(decodedString)
    } catch (error) {
        console.error('Error decoding JWT:', error)
        return null
    }
}

export default decodeJWTWithWebAPI