import multer from 'multer'
import path from 'path'
import fs from 'fs'

// ===== Folder =====
const imageDir = 'uploads/categories'
const resumeDir = 'uploads/resumes'

    ;[imageDir, resumeDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
    })

// ===== Storage =====
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'resumeFile') {
            cb(null, resumeDir)
        } else {
            cb(null, imageDir)
        }
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, unique + path.extname(file.originalname))
    }
})

// ===== Filter =====
const fileFilter = (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif']
    const docTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (imageTypes.includes(file.mimetype)) {
        cb(null, true)
    } else if (docTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('รองรับเฉพาะไฟล์รูปหรือเอกสารเท่านั้น'), false)
    }
}

// ===== Export =====
export const diskUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
})