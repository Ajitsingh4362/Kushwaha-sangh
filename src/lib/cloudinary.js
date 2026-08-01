// Uploads a video file directly from the browser to Cloudinary using an
// UNSIGNED upload preset. We deliberately never use the Cloudinary API
// secret here — secrets can't be safely shipped in frontend code. Instead,
// create an "unsigned" upload preset in the Cloudinary dashboard
// (Settings -> Upload -> Upload presets -> Add upload preset -> Signing
// mode: Unsigned) and put its name + your cloud name in the env vars below.
//
// Required env vars (see .env.example):
//   VITE_CLOUDINARY_CLOUD_NAME
//   VITE_CLOUDINARY_UPLOAD_PRESET

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

/**
 * Upload a video file to Cloudinary and return its public playback URL.
 * @param {File} file
 * @param {(percent: number) => void} [onProgress]
 * @returns {Promise<{ url: string, publicId: string, duration?: number }>}
 */
export function uploadVideoToCloudinary(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      reject(new Error('Cloudinary is not configured — check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'))
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)
    formData.append('resource_type', 'video')

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({ url: data.secure_url, publicId: data.public_id, duration: data.duration })
        } else {
          reject(new Error(data.error?.message || 'Video upload failed.'))
        }
      } catch (err) {
        reject(new Error('Video upload failed — could not parse response.'))
      }
    }

    xhr.onerror = () => reject(new Error('Video upload failed — network error.'))
    xhr.send(formData)
  })
}
