// post routerları buraya yazın

const express = require("express");

const Post = require("./posts-model")

const router = express.Router();

router.get("/", (req,res) => {
    Post.find()
    .then(found => {
        res.json(found)
    })
    .catch(err => {
        res.status(500).json({
            message: "Gönderiler alınamadı"
        })
    })
})


router.get("/:id", (req,res) => {
    Post.findById(req.params.id)
    .then(found => {
        if(!found){
        res.status(404).json({
            message: "Belirtilen ID'li gönderi bulunamadı"
        })
        } else {
        res.status(200).json(found)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "Gönderi bilgisi alınamadı"
        })
    })
})


router.post("/", (req,res) => {
    const { title, contents} = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: "Lütfen gönderi için bir title ve contents sağlayın"
        })
    } else {
        Post.insert({title,contents})
            .then(({id}) => {
                return Post.findById(id)
            }
            )
            .then(post => {
                res.status(201).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "Veritabanına kaydedilirken bir hata oluştu"
                })
            })
    }
})


router.delete("/:id", async (req,res) => {
    try {
        const data = await Post.findById(req.params.id)
        if(!data) {
            res.status(404).json({
                message: "Belirtilen ID'li kullanıcı bulunamadı"
            })
        } else {
            await Post.remove(req.params.id)
            res.status(200).json(data)
        }

    } catch (err) {
        res.status(500).json({
            message: "Gönderi silinemedi"
        })
    }
})



router.put("/:id", async (req,res) => {
    try{
        const  data = await Post.findById(req.params.id)
        if(!data) {
            res.status(404).json({
                message: "Belirtilen ID'li gönderi bulunamadı"
            })
        } else {
            const {title, contents} = req.body
            if(!title || !contents) {
                res.status(400).json({
                    message: "Lütfen gönderi için title ve contents sağlayın"
                })
            } else {
                await Post.update(req.params.id,req.body)
                const updatedData = await Post.findById(req.params.id)
                res.json(updatedData)
            }
        }
    } catch {
        res.status(500).json({
            message: "Gönderi güncellenemedi"
        })
    }
})


router.get("/:id/comments", async (req,res) => {
    try{
        const data = await Post.findById(req.params.id)
        if(!data) {
            res.status(404).json({
                message: "Girilen ID'li gönderi bulunamadı"
            })
        } else {
            const comment = await Post.findPostComments(req.params.id)
            res.json(comment)
        }
    } catch (err) {
        res.status(500).json({
            message: "Yorumlar bilgisi getirilemedi"
        })
    }
})


module.exports = router;