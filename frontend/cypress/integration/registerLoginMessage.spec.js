// login.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress
Cypress.on("uncaught:exception", (err, runnable) => false);

function generateRandomString(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const username1 = generateRandomString(8);
const password1 = generateRandomString(8);

const username2 = generateRandomString(8);
const password2 = generateRandomString(8);

describe("register, login, message", () => {
  it("sign up", () => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:3000/signup", { timeout: 30000 });
    cy.get("[id=basic_username]").type(username1);
    cy.get("[id=basic_password]").type(password1);
    cy.contains("Next").click();
    cy.wait(100);

    cy.get("[id=basic_firstname]").type("Larry");
    cy.get("[id=basic_lastname]").type("Huang");
    cy.contains("Next").click();
    cy.wait(100);

    cy.contains("Patient").click();
    cy.contains("Sign up").click();
    cy.wait(100);

    cy.contains("Successfully Created An Account!").should("be.visible");
    cy.contains(`Welcome ${username1}`).should("be.visible");
  });

  it("sign up 2", () => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:3000/signup");
    cy.get("[id=basic_username]").type(username2);
    cy.get("[id=basic_password]").type(password2);
    cy.contains("Next").click();
    cy.wait(100);

    cy.get("[id=basic_firstname]").type("Larry");
    cy.get("[id=basic_lastname]").type("Huang");
    cy.contains("Next").click();
    cy.wait(100);

    cy.contains("Patient").click();
    cy.contains("Sign up").click();
    cy.wait(100);

    cy.contains("Successfully Created An Account!").should("be.visible");
    cy.contains(`Welcome ${username2}`).should("be.visible");
  });

  it("login 2 and friend 1", () => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:3000/login");
    cy.get("[id=basic_username]").type(username2);
    cy.get("[id=basic_password]").type(password2);
    cy.contains("Log in").click();
    cy.wait(100);

    cy.get("[id=search_nav_bar]").click();
    cy.get("#rc_select_0").type(username1).type("{enter}");
    cy.wait(100);

    cy.contains("Request Friend").click();
  });

  it("login 1, friend 2, send message", () => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:3000/login");
    cy.get("[id=basic_username]").type(username1);
    cy.get("[id=basic_password]").type(password1);
    cy.contains("Log in").click();
    cy.wait(100);

    cy.get("[id=search_nav_bar]").click();
    cy.get("#rc_select_0").type(username2).type("{enter}");
    cy.wait(100);

    cy.contains("Accept").click();
    cy.wait(100);

    cy.get("[id=chat_nav_bar]").click();

    cy.get(".ant-input").type("im a goat");
    cy.get(".ant-btn").click();

    cy.wait(5000);
  });

  it("login 2 and check message", () => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:3000/login");
    cy.get("[id=basic_username]").type(username2);
    cy.get("[id=basic_password]").type(password2);
    cy.contains("Log in").click();
    cy.wait(100);

    cy.get("[id=chat_nav_bar]").click();
    cy.wait(1000);

    cy.contains("im a goat").should("be.visible");

    cy.get(".ant-input").type("indeed good sir");
    cy.get(".ant-btn").click();
  });
});
