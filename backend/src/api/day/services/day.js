'use strict';

/**
 * day service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::day.day');
