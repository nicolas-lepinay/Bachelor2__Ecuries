'use strict';

/**
 * horse router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::horse.horse');
