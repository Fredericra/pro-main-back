import { Router } from "express";
import Attemp from "../controller/user.controller";
import midelware from "../middleware";
import authControlleur from "../controller/auth.controller";
import multer from "multer";


const router = Router();
const upload = multer({storage:multer.memoryStorage()})
//active mode pro
router.post('/pro',midelware,upload.single('file'),authControlleur.professional)
//cree article
//
router.post('/register',Attemp.register)
router.post('/login',Attemp.Login)
router.post('/confirm',midelware,Attemp.confirm)
router.get('/getuser',midelware,Attemp.getUser)
router.get('/professionel',midelware,authControlleur.autPro)

//Article
router.post('/article',midelware,upload.array('files'),authControlleur.addArticle)
router.get('/getarticle',midelware,authControlleur.getArticle)
router.post('/deletearticle',midelware,authControlleur.deleteArticle)

//Publication
router.post('/publication',midelware,upload.array('files'),authControlleur.addPub);
router.post('/deletepub',midelware,authControlleur.deletePub);
router.get('/getpub',midelware,authControlleur.getPub);

export default router;