/**
 * SearchController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  friendlyName: 'Search things',


  description: 'Find a thing based on `REF` code.',


  inputs: {

    ref: {
      description: 'The `REF` code needed to find a thing.',
      type: 'string',
      required: true
    }

  },


  exits: {

    notFound: {
      description: 'There is no document with that `REF` code.',
      responseType: 'notFound'
    },

  },


  fn: async function ({ref}) {

    var thing = await Thing.findOne({
      ref: {
        contains: ref
      }
    });

    if (!thing) throw 'notFound';

    var url = require('url');
    var util = require('util');

    var imageSrc = url.resolve(sails.config.custom.baseUrl, 'doc/'+thing.id);

    return imageSrc;
  }
};


