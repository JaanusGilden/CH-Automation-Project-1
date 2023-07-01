beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

//BONUS TASK: add visual tests for registration form 3

/*
Task list:
* Test suite for visual tests for registration form 3 is already created
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns
    * checkboxes, their content and links
    * email format
 */

describe('Section 1: visual tests', ()=> {
    it('Radio buttons and their content', () => {
        cy.get('input[type="radio"]').should('have.length',4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')
    });

    it('Dropdown and dependencies between 2 dropdowns', () => {
        cy.get('#country').select(1).screenshot('Country drop-down')
        cy.get('#country').children().should('have.length',4)
        cy.get('#country').children().eq(0).should('have.value',"")
        cy.get('#country').children().eq(1).should('have.text',"Spain").and('have.attr','label').should('eq',"Spain")
        cy.get('#country').children().eq(2).should('have.text',"Estonia").and('have.attr','label').should('eq',"Estonia")
        cy.get('#country').children().eq(3).should('have.text',"Austria").and('have.attr','label').should('eq',"Austria")
        
        cy.get('#country').select(0)
        cy.get('#city').children().should('have.length',1)
        cy.get('#city').children().eq(0).should('have.value',"")

        cy.get('#country').select("Spain")
        cy.get('#city').children().should('have.length',5)
        cy.get('#city').children().eq(0).should('have.value',"")
        cy.get('#city').children().eq(1).should('have.text',"Malaga").and('have.attr','label').should('eq',"Malaga")
        cy.get('#city').children().eq(2).should('have.text',"Madrid").and('have.attr','label').should('eq',"Madrid")
        cy.get('#city').children().eq(3).should('have.text',"Valencia").and('have.attr','label').should('eq',"Valencia")
        cy.get('#city').children().eq(4).should('have.text',"Corralejo").and('have.attr','label').should('eq',"Corralejo")

        cy.get('#country').select("Estonia")
        cy.get('#city').children().should('have.length',4)
        cy.get('#city').children().eq(0).should('have.value',"")
        cy.get('#city').children().eq(1).should('have.text',"Tallinn").and('have.attr','label').should('eq',"Tallinn")
        cy.get('#city').children().eq(2).should('have.text',"Haapsalu").and('have.attr','label').should('eq',"Haapsalu")
        cy.get('#city').children().eq(3).should('have.text',"Tartu").and('have.attr','label').should('eq',"Tartu")

        cy.get('#country').select("Austria")
        cy.get('#city').children().should('have.length',4)
        cy.get('#city').children().eq(0).should('have.value',"")
        cy.get('#city').children().eq(1).should('have.text',"Vienna").and('have.attr','label').should('eq',"Vienna")
        cy.get('#city').children().eq(2).should('have.text',"Salzburg").and('have.attr','label').should('eq',"Salzburg")
        cy.get('#city').children().eq(3).should('have.text',"Innsbruck").and('have.attr','label').should('eq',"Innsbruck")
    })

    it('Checkboxes, their content and links', () => {
        // 3 ways to check textNode next to element
        // Note that textNode includes trailing whitespace as written in .html file, including newline and indentation
        cy.get('input[type="checkbox"]').eq(0)
          .then($el => $el[0].nextSibling.textContent.trim())
          .should('eq',"Accept our privacy policy")
        // childNodes includes a textNode before & after all elements, and between every element with the whitespace from .html file
        cy.get('input[type="checkbox"]').eq(0).parent()
          .then($el => Cypress._.filter($el[0].childNodes, {nodeType: Node.TEXT_NODE})[1].textContent.trim())
          .should('eq',"Accept our privacy policy")
        cy.get('input[type="checkbox"]').eq(0).parent()
          .then($el => $el[0].childNodes)
          .then(children => [...children].filter(child => child.nodeType === Node.TEXT_NODE)[1].nodeValue.trim())
          .should('eq',"Accept our privacy policy")

        cy.get('input[type="checkbox"]').eq(1).next().children().eq(0).should('have.text',"Accept our cookie policy")
          .and('have.attr','href').should('eq',"cookiePolicy.html")
    })

    it('Email format', () => {
        cy.get('input[type="email"]').type('test')
        cy.get('#emailAlert [ng-show="myForm.email.$error.email"]').should('be.visible')
        cy.get('input[type="email"]').clear().type('@test')
        cy.get('#emailAlert [ng-show="myForm.email.$error.email"]').should('be.visible')
        cy.get('input[type="email"]').clear().type('test@test')
        cy.get('#emailAlert > *').should('not.be.visible')
    })
})

//BONUS TASK: add functional tests for registration form 3

/*
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + validation
    * only mandatory fields are filled in + validations
    * mandatory fields are absent + validations (try using function)
    * If city is already chosen and country is updated, then city choice should be removed
    * add file (google yourself for solution)
 */

describe('Section 2: functional tests', ()=> {
    it('All fields are filled in + validation', () => {
        fillMandatory()
        fillExtra()
        checkSubmit()
    });

    it('Only mandatory fields are filled in + validations', () => {
        fillMandatory()
        checkSubmit()
    });

    it('Mandatory fields are absent + validations (try using function)', () => {
        // This is empty template
    });

    it('If city is already chosen and country is updated, then city choice should be removed', () => {
        cy.get('#country').select(1)
        cy.get('#city').select(1)
        cy.get('#city').find('option:selected').should('have.text','Malaga')
        cy.get('#country').select(2)
        cy.get('#city').should('not.be.selected')
    });

    it('Add file (google yourself for solution)', () => {
        cy.get('#myFile').selectFile('cypress/fixtures/cypress_logo.png')
    });
})

function fillMandatory() {
        cy.get('input[type="email"]').type('test@test')
        cy.get('#country').select(1)
        cy.get('#city').select(1)
        cy.get('input[type="checkbox"]').eq(0).check()
}

function fillExtra() {
        cy.get('#name').clear().type('Jaanus Gilden')
        cy.get('input[type="date"]').eq(0).type('1990-01-01')
        cy.get('input[type="radio"]').eq(0).check()
        cy.get('input[type="date"]').eq(1).type('1990-01-01')
        cy.get('input[type="checkbox"]').eq(1).check()
}

function checkSubmit() {
    cy.get('input[type="submit"][ng-disabled="myForm.$invalid"]').should('be.enabled')
}