const express=require("express")
const { ROUTE } = require("./routes")
const router=express.Router()
const Author=require("../models/author")
const Book=require("../models/book")

// All Authors

router.get(ROUTE.AuthorHome,async(req,res)=>{
    let searchOptions={}
    if(req.query.name!=null && req.query.name!==""){
        searchOptions.name=new RegExp(req.query.name,"i")
    }
    try {
        const authors=await Author.find(searchOptions)
        res.render("authors/index",{
            authors:authors,
            searchOptions:req.query
        })
    } catch  {
        res.redirect("/")
    }
    
})

// New Authors

router.get(ROUTE.NewAuthor,(req,res)=>{
    res.render("authors/new",{author: new Author()})
})

// Create new Author

router.post(ROUTE.CreateAuthor,async (req,res)=>{
    const author=new Author({
        name:req.body.name
    })
    try {
        const newAuthor=await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render("authors/new",{
            author:author,
            errorMessage:"Error creating author"
        })
    }
    
    
    
})

router.get("/:id",async(req,res)=>{
    try {
        const author=await Author.findById(req.params.id)
        const books=await Book.find({author:author.id}).limit(6).exec()
        res.render("authors/show",{
            author:author,
            booksByAuthor:books
        })
    } catch (error) {
        console.log(error)
        res.redirect("/")
        
    }
})

router.get("/:id/edit",async(req,res)=>{
    try {
        const author=await Author.findById(req.params.id)
        res.render("authors/edit",{author: author})
    } catch (error) {
        res.redirect("/authors")
    }
    
})

router.put("/:id",async(req,res)=>{
    let author;
    try {
        author=await Author.findById(req.params.id)
        author.name=req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } catch {
        if(author===null){
            res.redirect("/")
        }else{

            res.render("authors/edit",{
                author:author,
                errorMessage:"Error Updating author"
            })
        }
    }
})

router.delete("/:id",async(req,res)=>{
    let author;
    try {
        author=await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } catch {
        if(author===null){
            res.redirect("/")
        }else{

            res.redirect(`/authors/${author.id}`)
        }
    }
})

module.exports=router