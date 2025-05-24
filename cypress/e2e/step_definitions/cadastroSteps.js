import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que o usuário está na página de cadastro", () => {
  cy.visit("/signin"); // Ajuste para a URL do seu frontend
});

When('o usuário preenche o campo {string} com {string}', (campo, valor) => {
  // Supondo que o nome dos inputs no HTML sejam 'email' e 'senha'
  cy.get(`input[name="${campo}"]`).type(valor);
});

When('o usuário clica no botão {string}', (botao) => {
  cy.contains("button", botao).click();
});

Then('o sistema deve exibir a mensagem {string}', (mensagem) => {
  // Verifica se a mensagem aparece no frontend após resposta da API
  cy.contains(mensagem).should("be.visible");
});
