'use strict';

/**
 * refused service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::refused.refused');
