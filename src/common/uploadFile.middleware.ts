import multer, { diskStorage } from 'multer'
import path, { extname } from 'path'
import { v4 } from 'uuid'

const formatImages = ['image/png', 'image/jpeg', 'image/gif', 'image/webp']

const storage = diskStorage({
    destination(_, _file, callback) {
        callback(null, path.join(__dirname, '../../uploads'))
    },
    filename(_, file, callback) {
        const format = file.mimetype
        if(!formatImages.includes(format)){
            return callback(new Error('File not supported'), "")
        }
        const uid = v4()
        const ext = extname(file.originalname)
        callback(null, uid + ext)
    },
})

const upload = multer({
  storage,
})

export default upload