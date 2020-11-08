const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
require("./model/Postagem");
const Postagem = mongoose.model("postagem");

const app = express();

// Mongoose
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost/crud_node", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Mongo conectado...");
  })
  .catch((err) => {
    console.log("Houve um erro: " + err);
  });

app
  // Utilizar body do req
  .use(express.urlencoded({ extended: true }))

  // Arquivos estáticos
  .use(express.static("public"))

  // Template Engine
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "hbs")

  // Rotas
  .get("/", (req, res) => {
    Postagem.find()
      .then((postagens) => {
        // find vai listar todas as categorias q existem
        res.render("index", {
          postagens: postagens.map((Postagem) => Postagem.toJSON()),
        });
      })
      .catch((error) => {
        console.log("houve um erro ao listar as categorias " + error);
        res.redirect("/");
      });
  })

  .get("/novapostagem", (req, res) => {
    res.render("newpost");
  })

  .post("/novapostagem/add", (req, res) => {
    const novaPostagem = {
      titulo: req.body.titulo,
      conteudo: req.body.conteudo,
    };

    new Postagem(novaPostagem)
      .save()
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.log("Erro ao salvar postagem!" + err);
      });
  })

  .get("/editpost/:id", (req, res) => {
    Postagem.findOne({ _id: req.params.id })
      .lean()
      .then((postagem) => {
        res.render("editpost", { postagem: postagem });
      })
      .catch((err) => {
        console.log("Esta postagem não existe!");
        res.redirect("/");
      });
  })

  .post("/editpost/edit", (req, res) => {
    Postagem.findOne({ _id: req.body.id })
      .then((postagem) => {
        postagem.titulo = req.body.titulo;
        postagem.conteudo = req.body.conteudo;

        postagem
          .save()
          .then(() => {
            res.redirect("/");
          })
          .catch((err) => {
            console.log("Houve um erro: " + err);
          });
      })
      .catch((err) => {
        console.log("Erro ao atualizar postagem" + err);
      });
  })

  .get("/delete/:id", (req, res) => {
    Postagem.remove({ _id: req.params.id }).then(() => {
      res.redirect("/");
    });
  })

  .listen(5500, () => {
    console.log("Server running on port 5500");
  });
