parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {

    things: [],

    // The "virtual" portion of the URL which is managed by this page script.
    virtualPageSlug: '',

    // Form data
    uploadFormData: {
      file: undefined,
      title: '',
      ref: '',
      previewFileSrc: ''
    },

    // Modals which aren't linkable:
    confirmDeleteThingModalOpen: false,

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    selectedDoc: undefined
  },

  virtualPages: true,
  html5HistoryMode: 'history',
  virtualPagesRegExp: /^\/things\/?([^\/]+)?/,

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.docs = this._marshalEntries(this.docs);
  },

  mounted: function() {
    this.$find('[data-toggle="tooltip"]').tooltip();
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _marshalEntries: function(entries) {
      // Marshal provided array of data and return the modified version.
      return _.map(entries, (entry)=>{

        if(entry.owner.id === this.me.id) {
          entry.unavailable = false;
        }
        else {
          entry.unavailable = true;
        }
        return entry;
      });
    },

    _clearUploadDocModal: function() {
      // Close modal
      this.goto('/docs');
      // Reset form data
      this.uploadFormData = {
        file: undefined,
        title: '',
        ref: '',
        previewFileSrc: ''
      };
      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
    },

    clickAddButton: function() {
      // Open the modal.
      this.goto('/things/new');
    },

    closeUploadThingModal: function() {
      this._clearUploadThingModal();
    },

    handleParsingUploadDocForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.uploadFormData;

      if(!argins.file) {
        this.formErrors.file = true;
      }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return _.omit(argins, ['previewFileSrc']);
    },

    submittedUploadDocForm: function(result) {
      var newItem = _.extend(result, {
        tile: this.uploadFormData.title,
        ref: this.uploadFormData.ref,
        owner: {
          id: this.me.id,
          fullName: this.me.fullName
        }
      });

      // Add the new thing to the list
      this.docs.unshift(newItem);

      // Close the modal.
      this._clearUploadDocModal();
    },

    changeFileInput: function(files) {
      if (files.length !== 1 && !this.uploadFormData.file) {
        throw new Error('Consistency violation: `changeFileInput` was somehow called with an empty array of files, or with more than one file in the array!  This should never happen unless there is already an uploaded file tracked.');
      }
      var selectedFile = files[0];

      // If you cancel from the native upload window when you already
      // have a photo tracked, then we just avast (return early).
      // In this case, we just leave whatever you had there before.
      if (!selectedFile && this.uploadFormData.file) {
        return;
      }

      this.uploadFormData.file = selectedFile;

      // Set up the file preview for the UI:
      var reader = new FileReader();
      reader.onload = (event)=>{
        this.uploadFormData.previewFileSrc = event.target.result;

        // Unbind this "onload" event.
        delete reader.onload;
      };
      // Clear out any error messages about not providing an image.
      this.formErrors.photo = false;
      reader.readAsDataURL(selectedFile);

    },

    clickDeleteDoc: function(docId) {
      this.selectedDoc = _.find(this.docs, {id: docId});

      // Open the modal.
      this.confirmDeleteDocModalOpen = true;
    },

    closeDeleteDocModal: function() {
      this.selectedDoc = undefined;
      this.confirmDeleteDocModalOpen = false;
      this.cloudError = '';
    },

    handleParsingDeleteDocForm: function() {
      return {
        id: this.selectedDoc.id
      };
    },

    submittedDeleteDocForm: function() {

      // Remove the thing from the list
      _.remove(this.docs, {id: this.selectedDoc.id});

      // Close the modal.
      this.selectedDoc = undefined;
      this.confirmDeleteDocModalOpen = false;
    },

    clickContactBorrower: function(thingId) {//eslint-disable-line no-unused-vars
      // FUTURE: This is where we can add a modal
      // with a space to write a message to the borrower of the item.
    },

    clickContactOwner: function(thingId) {//eslint-disable-line no-unused-vars
      // FUTURE: This is where we can add a modal
      // with a space to write a message to the owner of the item.
    },

  }
});
