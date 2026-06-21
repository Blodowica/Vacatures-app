import { DetailPage } from '../../support/pages';

/**
 * Vacancy detail page (`/vacatures/:id`).
 *
 * Covers deep-linking to a military and a civilian vacancy, the apply
 * (mailto) link generation, the rendered content sections, and the
 * bad-weather "not found" case for an unknown id.
 */
describe('Vacancy detail', () => {
  // ---- Happy flow: military ----------------------------------------------

  describe('a military vacancy', () => {
    beforeEach(() => {
      DetailPage.visit('mil-1');
    });

    it('renders the title, department and military badge', () => {
      DetailPage.title().should('have.text', 'Software Engineer Defensie');
      DetailPage.department().should('have.text', 'Joint IT Commando');
      DetailPage.page().should('contain', 'Militair');
      DetailPage.page().should('contain', 'Sergeant'); // rank tag
      DetailPage.page().should('contain', 'Den Haag'); // location badge
    });

    it('renders every content section', () => {
      DetailPage.page()
        .should('contain', 'Wat doe ik?')
        .and('contain', 'Competenties')
        .and('contain', 'Hoe ziet mijn week eruit?')
        .and('contain', 'Tijdverdeling');
    });

    it('renders the data of every child component', () => {
      DetailPage.page()
        .should('contain', 'Je bouwt veilige software') // role description
        .and('contain', 'Angular') // skills-section
        .and('contain', 'Jan de Vries') // contact-section
        .and('contain', 'Sprint Planning') // weekly-calendar
        .and('contain', 'Ontwikkeling'); // work-distribution
    });

    it('builds a mailto apply link with the encoded subject', () => {
      DetailPage.applyButton()
        .should('have.attr', 'href', 'mailto:jan.devries@mindef.nl?subject=Sollicitatie%20Software%20Engineer%20Defensie')
        .and('have.attr', 'target', '_blank');
    });
  });

  // ---- Happy flow: civilian ----------------------------------------------

  describe('a civilian vacancy', () => {
    beforeEach(() => {
      DetailPage.visit('civ-1');
    });

    it('renders the civilian badge and scale tag', () => {
      DetailPage.title().should('have.text', 'Backend Developer');
      DetailPage.page().should('contain', 'Burgerpersoneel');
      DetailPage.page().should('contain', 'Schaal 10');
    });

    it('builds the correct mailto apply link', () => {
      DetailPage.applyButton().should(
        'have.attr',
        'href',
        'mailto:piet.jansen@mindef.nl?subject=Sollicitatie%20Backend%20Developer',
      );
    });
  });

  // ---- Bad flow -----------------------------------------------------------

  describe('an unknown vacancy', () => {
    beforeEach(() => {
      DetailPage.visit('does-not-exist');
    });

    it('shows a "not found" message and no detail content', () => {
      DetailPage.notFound().should('be.visible').and('contain', 'Vacature niet gevonden');
      DetailPage.title().should('not.exist');
      DetailPage.applyButton().should('not.exist');
    });

    it('offers a link back to the overview', () => {
      DetailPage.notFound().find('[data-cy="back-link"]').should('have.attr', 'href', '/');
    });
  });
});
