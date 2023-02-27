function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

async function generateIVFromString(str: any): Promise<Uint8Array> {
  const data = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-512', data)
  return new Uint8Array(hash.slice(0, 16))
}

async function JonatanVillelaEncrypt(
  value: string,
  password: string,
  ivget: number[]
) {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )
  const iv = new Uint8Array(ivget)
  const key = await window.crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: iv, iterations: 100000, hash: 'SHA-512' },
    keyMaterial,
    { name: 'AES-CTR', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  const encryptedData = await window.crypto.subtle.encrypt(
    { name: 'AES-CTR', counter: iv, length: 128 },
    key,
    new TextEncoder().encode(value)
  )
  return {
    key,
    encryptedData: btoa(String.fromCharCode(...new Uint8Array(encryptedData))),
    iv: Array.from(iv)
  }
}

export { toBase64, generateIVFromString, JonatanVillelaEncrypt }
