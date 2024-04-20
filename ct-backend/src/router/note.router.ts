import express from 'express'
import multer from 'multer'
import { checkLikeOrCollectParams, checkNoteIdExists, checkNoteParams, checkTagIsValid } from '@src/middleware/note.middleware'
import { checkIdAndAccountExists } from '@src/middleware/users.middleware'
import { checkPageParams, checkViewerId, storage } from '@src/middleware/common.middleware'
import { verifyCSRFSession, verifyToken } from '@src/middleware/auth.middleware'
import NotesController from '@src/controller/notes.controller'

const router = express.Router()
const { likeOrCollect, publish, getWithPage, getDetail, getByTag } = NotesController

router.post("/like_or_collect", checkIdAndAccountExists, verifyToken, verifyCSRFSession, checkLikeOrCollectParams, likeOrCollect);

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
