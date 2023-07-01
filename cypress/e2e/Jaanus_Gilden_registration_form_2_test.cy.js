beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', ()=>{
        // Add test steps for filling in only mandatory fields
        inputValidData()
        // Type confirmation password which is different from first password
        cy.get('#confirm').clear().type('different')
        cy.get('h2').contains('Password').click()
        // Assert that submit button is not enabled
        cy.get('.submit_button').should('be.disabled')
        // Assert that successful message is not visible
        cy.get('#success_message').should('not.be.visible')
        // Assert that error message is visible
        cy.get('#password_error_message').should('be.visible')
        
        cy.get('#confirm').clear().type('MyPass')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('#password_error_message').should('not.be.visible')
    })
    
    it('User can submit form with all fields added', ()=>{
        // Add test steps for filling in ALL fields
        inputValidData()
        inputExtraData()
        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled')
        // Assert that after submitting the form system show successful message
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
    })

    it('User can submit form with valid data and only mandatory fields added', ()=>{
        // Add test steps for filling in ONLY mandatory fields
        inputValidData()
        // Assert that submit button is enabled
        cy.get('.submit_button').should('be.enabled')
        // Assert that after submitting the form system shows successful message
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible')
    })

    it('Input valid data to the page', () => {
        inputValidData()
    })

    // You can add more similar tests for checking other mandatory field's absence

    it('Submit button disabled when any mandatory field empty', ()=>{
        inputValidData()
        clearAndCheck('input[data-testid="user"]')
        // email is not mandatory
        //clearAndCheck('#email')
        clearAndCheck('[data-cy="name"]')
        clearAndCheck('#lastName')
        clearAndCheck('[data-testid="phoneNumberTestId"]')
        clearAndCheck('#password')
        clearAndCheck('#confirm')
        // also if BOTH password fields are empty, submit button is still enabled
    })

})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height, to be equal 178
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)
    })

    // Create similar test for checking second picture
    it('Check that 2nd logo is correct and has correct size', () => {
        cy.log('Will check 2nd logo source and size')
        cy.get('img[data-cy="cypress_logo"]').should('have.attr', 'src').should('include', 'cypress_logo')
        cy.get('img[data-cy="cypress_logo"]').invoke('width').should('eq', 116)
        cy.get('img[data-cy="cypress_logo"]').invoke('height').should('eq', 88)
    })

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)

        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        // Get navigation element, find its first child, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    // Create similar test for checking second link to Cerebrum Hub homepage
    // Check that URL to Cerebrum Hub page is correct and clickable
    it('Check 2nd link', () => {
        cy.get('nav').children().should('have.length', 2)
        
        // Get navigation element, find its second child, check the link content and click it
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'https://cerebrumhub.com/')
            .click()
        
        // Check that currently opened URL is correct
        cy.url().should('contain', 'https://cerebrumhub.com/')
        
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript').and('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP').and('not.be.checked')

        // Selecting one will remove selection from other radio button
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    // Create test similar to previous one
    it('Check that checkbox list is correct', () => {
        cy.get('input[type="checkbox"]').should('have.length',3)
        cy.get('input[type="checkbox"]').next().eq(0).should('have.text',"I have a bike").and('not.be.checked')
        cy.get('input[type="checkbox"]').next().eq(1).should('have.text',"I have a car").and('not.be.checked')
        cy.get('input[type="checkbox"]').next().eq(2).should('have.text',"I have a boat").and('not.be.checked')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(0).should('be.checked')
    })

    it('Car dropdown is correct', () => {
        // Here is an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area, and full page
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        //Check  that first element in the dropdown has text Volvo
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })


    // Create test similar to previous one
    it('Animal dropdown is correct', () => {
        cy.get('#animal').children().should('have.length', 6)
        cy.get('#animal').children().eq(0).should('have.value',"dog").and('have.text',"Dog")
        cy.get('#animal').children().eq(1).should('have.value',"cat").and('have.text',"Cat")
        cy.get('#animal').children().eq(2).should('have.value',"snake").and('have.text',"Snake")
        cy.get('#animal').children().eq(3).should('have.value',"hippo").and('have.text',"Hippo")
        cy.get('#animal').children().eq(4).should('have.value',"spider").and('have.text',"Cow")
        cy.get('#animal').children().eq(5).should('have.value',"mouse").and('have.text',"Horse")
    })

})

function inputValidData() {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type('Something')
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    // If element has multiple classes, then one of them can be used
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
}

function inputExtraData(){
    cy.get('#cssFavLanguage').check()
    cy.get('#vehicle1').check()
    cy.get('#cars').select('saab')
    cy.get('#animal').select(1)
    cy.get('h2').contains('Password').click()
}

function clearAndCheck(s){
    cy.get(s).invoke('val').then((val)=>{
        cy.get(s).clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get(s).type(val)
    })
}