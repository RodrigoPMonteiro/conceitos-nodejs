const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", (request, response) =>{
  // TODO
  const { title, url, techs } = request.body;

  const repository = { 
      id: uuid(),
      title,
      url,
      techs,
      likes : 0 
    }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if( repoIndex < 0 ) {
    return response.status(400).json( { error : 'Repository not found'}) // 400 -- erro no backend
  }

  /*
    should not be able to update repository likes manually: 
    Para que esse teste passe, você não deve permitir que sua rota de update altere diretamente 
    os likes desse repositório, mantendo o mesmo número de likes que o repositório já possuia 
    antes da atualização. 
    Isso porque o único lugar que deve atualizar essa informação é a rota 
    responsável por aumentar o número de likes.
  */  


  // Cria uma variável para armazenar os dados de like já existentes

  const updatedRepo = repositories[repoIndex];

  // Atualiza a variável "updateRepo" somente com os campos que podem ser alterados
  // o campo "Likes" deve ser mantido o que já havia no array
  updatedRepo.title = title;
  updatedRepo.url = url;
  updatedRepo.techs = techs;

  // atualiza o array original( tabela do banco ) com os dados que vieram nos Route Params
  repositories[repoIndex] = updatedRepo;

  // devolve somente a variável atualizada!
  return response.json(updatedRepo);

  //PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que
  // possua o id igual ao id presente nos parâmetros da rota; 

});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  //DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if ( repoIndex < 0 ){
    return response.status(400).json({ error: 'Repository not found'})
  }

  repositories.splice( repoIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const {id} = request.params;

  const repository = repositories.find(repository => repository.id === id);
  const repoIndex = repositories.findIndex(repository => repository.id === id);

  if ( repoIndex < 0 ){
    return response.status(400).json({ error: 'Repository not found'})
  }

  repository.likes +=1 ;
  
  return response.json(repository);
});

module.exports = app;
