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

    // Get the list of all docs.
    var docs = await Doc.find().populate('owner');

    sails.log('docs', docs);

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
