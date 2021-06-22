/**
 * Doc.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    fileUploadFd: {
      type: 'string',
      description: 'The Skipper file descriptor string uniquely identifying the uploaded image.',
      required: true
    },

    fileUploadMime: {
      type: 'string',
      description: 'The MIME type for the uploaded image.',
      required: true
    },

    title: {
      type: 'string',
      description: 'A product title.',
      example: 'Dura Repair'
    },

    ref: {
      type: 'string',
      description: 'A (very) brief description of the item.',
      example: 'xxxxxx,xxxxxx,xxxxxx'
    },

    expectedReturnAt: {
      type: 'number',
      description: 'A JS timestamp (epoch ms) representing the moment of this item\'s expected return (or 0, if it is not currently lent out).',
      example: 1502844074211
    },

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    owner: { model: 'User', description: 'The user who uploaded this item.' }

  },

};

