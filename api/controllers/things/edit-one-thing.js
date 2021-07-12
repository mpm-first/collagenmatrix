module.exports = {


  friendlyName: 'Edit one thing',


  description:
  `Update a thing, either adding information about a borrower and expected return time,
  or clearing out that information if the item has been returned.`,

  files: ['photo'],

  inputs: {

    id: {
      description: 'The id of the thing to update.',
      type: 'number',
      required: true
    },

    photo: {
      description: 'Upstream for an incoming file upload.',
      type: 'ref'
    },

    label: {
      type: 'string',
      description: 'A (very) brief description of the item.'
    },

    ref: {
      type: 'string',
      description: 'REF code(s) comma separated.'
    },
  },


  exits: {

    notFound: {
      responseType: 'notFound'
    },

    forbidden: {
      responseType: 'forbidden'
    },

  },


  fn: async function ({id, photo, label, ref}) {

    var thingToUpdate = await Thing.findOne({ id });

    // Ensure the thing still exists.
    if(!thingToUpdate) throw 'notFound';

    var url = require('url');
    var util = require('util');

    // Upload the image.
    var info = await sails.uploadOne(photo, {
      maxBytes: 3000000
    })
    // Note: E_EXCEEDS_UPLOAD_LIMIT is the error code for exceeding
    // `maxBytes` for both skipper-disk and skipper-s3.
    .intercept('E_EXCEEDS_UPLOAD_LIMIT', 'tooBig')
    .intercept((err)=>new Error('The photo upload failed: '+util.inspect(err)));

    if(!info) {
      throw 'noFileAttached';
    }

    var imageSrc = url.resolve(sails.config.custom.baseUrl, '/api/v1/things/'+newThing.id+'/photo');

    // Update the `thing` record.
    await Thing.update({id}).set({
      imageUploadFd: info.fd,
      imageUploadMime: info.type,
      ref: ref,
      label,
      owner: this.req.me.id
    });

    // Return the newly-created thing, with its `imageSrc`
    return {
      id: newThing.id,
      imageSrc
    };

    // Verify permissions.
    // if(thingToUpdate.owner !== this.req.me.id) {
    //   throw 'forbidden';
    // }

  }


};
