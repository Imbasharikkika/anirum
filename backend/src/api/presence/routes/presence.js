'use strict';

/**
 * presence router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::presence.presence');
