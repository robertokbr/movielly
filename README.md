# Movielly
Uma API para criar e compartilhar seu feedback sobre seus filmes favoritos!

## Como rodar a API
> Para rodar esta api, é necessário que você tenha installado em seu computador o Node.JS.
> É recomendado que você tenha instalado o app Insomnia. Um cliente http.

* Instalar os pacotes
```bash
	npm install
    ou
  yarn
```

* Iniciar banco de dados
```bash
  npm run db:setup
    ou
  yarn db:setup

```

* Rodar o app

```bash
	npm run dev
    ou
  yarn dev
```

* Importar o arquivo do insomnia no app.

> Pronto! Agora você pode testar a API o quanto quiser.

### Logs de mudanças
- Em todos os testes de integração foram removidos os `await prismaService.reset()` de todas as funções do Jest com exceção da função `afterEach`, visto que o problema do banco de dados não era falta de reset e sim o paralelismo com que os testes estavam rodando.
