'use strict';

/**
 * horse service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::horse.horse');
