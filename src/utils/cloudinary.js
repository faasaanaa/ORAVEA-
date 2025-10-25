export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error('Cloudinary not configured')
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(url, { method: 'POST', body: fd })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Cloudinary upload failed')
  return data.secure_url
}
