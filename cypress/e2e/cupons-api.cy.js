/// <reference types="cypress" />
const token = require('../fixtures/token.json')
const cupom = require('../fixtures/cupom.json')

it('Deve validar autenticação', () => {
    cy.request({
        method: 'GET',
        url: `coupons`,
        failOnStatusCode: false
    }).then(response => {
        expect(response.status).to.equal(401)
        expect(response.body.message).to.contain("Sem permissão para listar recursos.")
    })
});

it('Deve listar todos os cupons', () => {
    cy.request({
        method: 'GET',
        url: `coupons`,
        headers: {authorization: token.auth}
    }).then(response => {
        expect(response.status).to.equal(200)
        expect([response.body]).to.be.instanceOf(Array)
    })
});

it('Deve listar um cupom específico', () => {
    cy.request({
        method: 'GET',
        url: `coupons/${cupom.id}`,
        headers: {authorization: token.auth}
    }).then(response => {
        expect(response.status).to.equal(200)
        expect([response.body]).to.be.instanceOf(Array)     
    })
});

it('Deve validar um cupom inválido', () => {
    cy.request({
        method: 'GET', 
        url: `coupons/${cupom.fake_id}`,
        headers: {authorization: token.auth}, 
        failOnStatusCode: false 
    }).then(response => {
        expect(response.status).to.equal(404)
        expect(response.body.message).to.contain("ID inválido.")        
    })   
});

it('Deve criar um novo cupom', () => {
    let code = `Coupon ${Math.floor(Math.random() * 10000)}`

    cy.request({
        method: 'POST', 
        url: `coupons/`,
        headers: {authorization: token.auth}, 
        body:
        {
            "code": code,
            "amount": cupom.amount,
            "discount_type": cupom.discount_type,
            "description": cupom.description
        }
    }).then(response => {
        expect(response.status).to.equal(201)
        expect([response.body]).to.be.instanceOf(Array)
    })
});

it('Deve validar que já existe cupom com mesmo código', () => {
    cy.request({
        method: 'POST', 
        url: `coupons/`,
        headers: {authorization: token.auth}, 
        body: 
        {
            "code": cupom.code,
            "amount": cupom.amount,
            "discount_type": cupom.discount_type,
            "description": cupom.description
          }, 
          failOnStatusCode: false  
    }).then(response => {
        expect(response.status).to.equal(400) 
        expect(response.body.message).to.contain("O código de cupom já existe")   
    })  
});

it('Deve validar ausência de parâmetros obrigatórios', () => {
    cy.request({
        method: 'POST', 
        url: `coupons/`,
        headers: {authorization: token.auth}, 
        body: 
        {            
            "amount": cupom.amount,
            "discount_type": cupom.discount_type,
            "description": cupom.description
          }, 
          failOnStatusCode: false  
    }).then(response => {
        expect(response.status).to.equal(400)         
        expect(response.body.message).to.contain("Parâmetro(s) ausente(s): code")
    })  
});