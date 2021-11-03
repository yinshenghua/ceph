import { HostsPageHelper } from 'cypress/integration/cluster/hosts.po';
import { ServicesPageHelper } from 'cypress/integration/cluster/services.po';
import { PageHelper } from 'cypress/integration/page-helper.po';
import { NotificationSidebarPageHelper } from 'cypress/integration/ui/notification.po';

const pages = {
  index: { url: '#/expand-cluster', id: 'cd-create-cluster' }
};
export class CreateClusterWizardHelper extends PageHelper {
  pages = pages;

  createCluster() {
    cy.get('cd-create-cluster').should('contain.text', 'Please expand your cluster first');
    cy.get('[name=expand-cluster]').click();
    cy.get('cd-wizard').should('exist');
  }

  doSkip() {
    cy.get('[name=skip-cluster-creation]').click();
    cy.contains('cd-modal button', 'Continue').click();

    cy.get('cd-dashboard').should('exist');
    const notification = new NotificationSidebarPageHelper();
    notification.open();
    notification.getNotifications().should('contain', 'Cluster expansion skipped by user');
  }

  createOSD(deviceType: 'hdd' | 'ssd') {
    // Click Primary devices Add button
    cy.get('cd-osd-devices-selection-groups[name="Primary"]').as('primaryGroups');
    cy.get('@primaryGroups').find('button').click();

    // Select all devices with `deviceType`
    cy.get('cd-osd-devices-selection-modal').within(() => {
      cy.get('.modal-footer .tc_submitButton').as('addButton').should('be.disabled');
      this.filterTable('Type', deviceType);
      this.getTableCount('total').should('be.gte', 1);
      cy.get('@addButton').click();
    });
  }
}

export class CreateClusterHostPageHelper extends HostsPageHelper {
  pages = {
    index: { url: '#/expand-cluster', id: 'cd-wizard' },
    add: { url: '', id: 'cd-host-form' }
  };

  columnIndex = {
    hostname: 1,
    labels: 2,
    status: 3,
    services: 0
  };
}

export class CreateClusterServicePageHelper extends ServicesPageHelper {
  pages = {
    index: { url: '#/expand-cluster', id: 'cd-wizard' },
    create: { url: '', id: 'cd-service-form' }
  };

  columnIndex = {
    service_name: 1,
    placement: 2,
    running: 0,
    size: 0,
    last_refresh: 0
  };
}
