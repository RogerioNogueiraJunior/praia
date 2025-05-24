Funcionalidade: Cadastro de usuário

  Como um novo usuário
  Quero me cadastrar no sistema
  Para poder acessar minhas funcionalidades personalizadas

  Cenário: Cadastro com dados válidos
    Dado que o usuário está na página de cadastro
    Quando o usuário preenche o campo "nome" com "João Silva"
    E o usuário preenche o campo "email" com "joao.silva@example.com"
    E o usuário preenche o campo "senha" com "SenhaForte123"
    E o usuário confirma a senha com "SenhaForte123"
    E o usuário clica no botão "Cadastrar"
    Então o sistema deve exibir a mensagem "Cadastro realizado com sucesso"
