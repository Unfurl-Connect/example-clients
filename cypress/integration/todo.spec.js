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
import { mock } from '@depay/web3-mock'
const sigUtil = require('eth-sig-util');
const Wallet = require('ethereumjs-wallet');

function mockEthereum(win, nonce){
  const EthWallet = Wallet.default.generate();
  let accounts = [EthWallet.getAddressString()]
  const secret = EthWallet.getPrivateKey()
  const chainId = '0x1'
  {
    let message = {
      domain: {
        chainId: chainId,
        name: 'Verify account(s) to Unfurl',
        verifyingContract: 'https://unfurl-connect.com',
        version: '1',
      },
      message: {
        name: 'Connecting to Unfurl',
        wallets: accounts,
        nonce
      },
      primaryType: 'Person',
      types: {
        // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        // Not an EIP712Domain definition
        Group: [
          { name: 'name', type: 'string' },
          { name: 'members', type: 'Person[]' },
        ],
        // Refer to PrimaryType
        Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person[]' },
          { name: 'contents', type: 'string' },
        ],
        // Not an EIP712Domain definition
        Person: [
          { name: 'name', type: 'string' },
          { name: 'wallets', type: 'address[]' },
          { name: 'nonce', type: 'string' },
        ],
      },
    }
    const messageHex = sigUtil.signTypedData_v4(secret, {
      data:message
    })
    mock({
      blockchain: 'ethereum',
      window:win,
      accounts :{ return :accounts},
      signature: {
        params: [accounts[0], JSON.stringify(message)],
        return: messageHex
      }
    })
    win.ethereum.isMetaMask
    cy.wrap(window.ethereum).as('ethereum')
    // })
  }
}

describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('https://devlocal.com:3020/')
  })

  it('User can connect with ethereum', () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.contains("Connect with unfurl", {matchCase: false}).click()
    cy.get('#nonce').invoke('val').then((nonce) =>
        cy.window().then((win) => mockEthereum(win, nonce))
    )
    cy.window().should('have.property', 'ethereum')
    cy.contains("Connect with Wallet", {matchCase: false}).click()
    //
    cy.get('button[type=submit]').contains("allow", {matchCase: false}).click()
    cy.contains("Acme Dashboard", {matchCase: false})
    cy.contains("log out", {matchCase: false})

  })
  it('User can connect with Google', () => {
    cy.contains("Connect with unfurl", {matchCase: false}).click()
    cy.get('#nonce').invoke('val').then((nonce) =>
        cy.log(nonce)
    )
    cy.contains("Continue with Google", {matchCase: false}).click()
    cy.wait(1000)
  })
})
