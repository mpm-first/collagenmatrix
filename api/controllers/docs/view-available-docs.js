module.exports = {


  friendlyName: 'View available docs',


  description: 'Display "Docs" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/docs/available-docs'
    }

  },


  fn: async function () {

    var url = require('url');

    // Get the list of docs this user can see.
    var docs = await Doc.find({
      or: [
        // My docs:
        { owner: this.req.me.id }
      ]
    })
    .populate('owner')
    .populate('borrowedBy');

    _.each(docs, (doc)=> {
      doc.fileSrc = url.resolve(sails.config.custom.baseUrl, '/api/v1/docs/'+doc.id+'/doc');
      delete doc.fileUploadFd;
      delete doc.fileUploadMime;
    });

    // Respond with view.
    return {
      currentSection: 'docs',
      docs: docs,
    };

  }


};
