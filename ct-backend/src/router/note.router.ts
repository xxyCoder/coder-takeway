import express from 'express'
import multer from 'multer'
import { checkLikeParams, checkNoteIdExists, checkNoteParams, checkTagIsValid } from '@src/middleware/note.middleware'
import { checkIdAndAccountExists } from '@src/middleware/users.middleware'
import { checkPageParams, checkViewerId, storage } from '@src/middleware/common.middleware'
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware'
import NotesController from '@src/controller/notes.controller'

const router = express.Router()
const { like, publish, getWithPage, getDetail, getByTag } = NotesController

router.post("/like", checkIdAndAccountExists, verifyToken, verifyCSRFSession, checkLikeParams, like);

const uploadMedia = multer({
    storage,
    limits: {
        files: 6 // 限制最多上传六个文件
    }
})
router.post("/publish", checkIdAndAccountExists, verifyToken, verifyCSRFSession, uploadMedia.array('mediaList', 6), checkTagIsValid, checkNoteParams, publish);
router.get("/viewer_note", verifyCSRFSession, checkPageParams, checkViewerId, getWithPage);
router.get("/detail", verifyCSRFSession, checkNoteIdExists, getDetail);
router.get("/explore_note", verifyCSRFSession, checkTagIsValid, checkPageParams, getByTag);

export default router
