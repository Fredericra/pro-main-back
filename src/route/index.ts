import { Router } from "express";
import Attemp from "../controller/user.controller";
import midelware from "../middleware";
import authControlleur from "../controller/auth.controller";
import multer from "multer";


const router = Router();
const upload = multer({storage:multer.memoryStorage()})

router.post('/pro',midelware,upload.single('file'),authControlleur.professional)
router.post('/register',Attemp.register)
router.post('/login',Attemp.Login)
router.post('/confirm',midelware,Attemp.confirm)
router.get('/getuser',midelware,Attemp.getUser)
router.get('/professionel',midelware,authControlleur.autPro)


export default router;