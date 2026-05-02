// Presenter info — referenced from slides for chips, cards, and section attribution.
// The contact block below feeds the PresenterContactCard popup AND the
// vCard download (save-to-phone). To update info: change the values
// here and re-deploy.

export const PRESENTERS = {
  romik: {
    id: 'romik',
    name: 'Romik Hacobian',
    firstName: 'Romik',
    role: 'CEO',
    company: 'Media City Design LLC',
    companyShort: 'Media City Design',
    photo: '/assets/romik.jpg',
    logo: '/assets/mcd-logo.png',
    accentColor: 'cyan',
    contact: {
      phone: '(818) 900-5750',
      email: 'info@mediacitydesign.com',
      website: 'www.mediacitydesign.com',
      address: {
        street: '200 W Magnolia Blvd',
        city: 'Burbank',
        state: 'CA',
        zip: '91501'
      }
    }
  },
  jim: {
    id: 'jim',
    name: 'Jim Festante',
    firstName: 'Jim',
    role: 'CEO',
    company: 'Health-e-Habits',
    companyShort: 'Health-e-Habits',
    photo: '/assets/jim.jpg',
    logo: '/assets/healthe-logo.png',
    accentColor: 'amber',
    contact: {
      phone: '',
      email: 'jim.festante@health-e-habits.org',
      website: 'www.health-e-habits.org',
      address: {
        street: '',
        city: 'Burbank',
        state: 'CA',
        zip: ''
      }
    }
  }
}
