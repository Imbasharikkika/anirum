'use strict';

/**
 * presence service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::presence.presence');
