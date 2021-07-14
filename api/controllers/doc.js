module.exports = {


  friendlyName: 'Download doc',


  description: 'Download a doc of a borrowable thing.',


  inputs: {

    id: {
      description: 'The id of the item whose doc we\'re downloading.',
      type: 'string',
      required: true
    }

  },


  exits: {

    success: {
      outputDescription: 'The streaming bytes of the specified thing\'s doc.',
      outputType: 'ref'
    },

    forbidden: { responseType: 'forbidden' },

    notFound: { responseType: 'notFound' }

  },


  fn: async function ({id}) {

    sails.log('ID', id);

    var thing = await Thing.findOne({
      'id': id
    });

    if (!thing) throw 'notFound';

    // Check permissions.
    // (So people can't see images of stuff that isn't from their friends or themselves.)
    // var itemBelongsToFriend = _.any(this.req.me.friends, {id: thing.owner});
    // if (this.req.me.id !== thing.owner && !itemBelongsToFriend) {
    //   throw 'forbidden';
    // }

    this.res.type(thing.imageUploadMime);

    var downloading = await sails.startDownload(thing.imageUploadFd);

    return downloading;

  }


};
