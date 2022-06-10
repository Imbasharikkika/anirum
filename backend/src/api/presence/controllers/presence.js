'use strict';

/**
 *  presence controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::presence.presence');
