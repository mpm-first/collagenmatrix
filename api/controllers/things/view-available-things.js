module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function () {

    var url = require('url');

    // Get the list of things this user can see.
    var things = await Thing.find();

    _.each(things, (thing)=> {
      thing.imageSrc = url.resolve(sails.config.custom.baseUrl, '/doc/'+thing.id);
      delete thing.imageUploadFd;
      delete thing.imageUploadMime;
    });

    // Respond with view.
    return {
      currentSection: 'things',
      things: things,
    };

  }


};
