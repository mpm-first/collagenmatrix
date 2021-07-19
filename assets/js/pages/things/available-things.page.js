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
      photo: undefined,
      label: '',
      ref: '',
      previewImageSrc: ''
    },

    editFormData: {
      id: '',
      photo: undefined,
      label: '',
      ref: '',
      previewImageSrc: ''
    },

    // Modals which aren't linkable:
    confirmEditThingModalOpen: false,
    confirmDeleteThingModalOpen: false,

    // For tracking client-side validation errors in our form.
    // > Has property set to `true` for each invalid property in `formData`.
    formErrors: { /* … */ },

    // Syncing / loading state
    syncing: false,

    // Server error state
    cloudError: '',

    selectedThing: undefined
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
    this.things = this._marshalEntries(this.things);
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

        var isBorrowed = !_.isNull(entry.borrowedBy);

        if(entry.owner.id === this.me.id) {
          entry.unavailable = false;
        }
        else if(!isBorrowed) {
          entry.unavailable = false;
        }
        else if(entry.borrowedBy.id === this.me.id) {
          entry.unavailable = false;
        }
        else {
          entry.unavailable = true;
        }
        return entry;
      });
    },

    _clearUploadThingModal: function() {
      // Close modal
      this.goto('/things');
      // Reset form data
      this.uploadFormData = {
        photo: undefined,
        label: '',
        ref: '',
        previewImageSrc: ''
      };
      // Clear error states
      this.formErrors = {};
      this.cloudError = '';
    },

    _clearEditThingModal: function() {
      // Close modal
      this.goto('/things');
      // Reset form data
      this.editFormData = {
        id: '',
        photo: undefined,
        label: '',
        ref: '',
        previewImageSrc: ''
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

    closeEditThingModal: function() {
      this._clearEditThingModal();
    },

    handleParsingUploadThingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.uploadFormData;

      if(!argins.photo) {
        this.formErrors.photo = true;
      }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return _.omit(argins, ['previewImageSrc']);
    },

    handleParsingEditThingForm: function() {
      // Clear out any pre-existing error messages.
      this.formErrors = {};

      var argins = this.editFormData;

      // if(!argins.photo) {
      //   this.formErrors.photo = true;
      // }

      // If there were any issues, they've already now been communicated to the user,
      // so simply return undefined.  (This signifies that the submission should be
      // cancelled.)
      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return _.omit(argins, ['previewImageSrc']);
    },

    submittedUploadThingForm: function(result) {
      var newItem = _.extend(result, {
        label: this.uploadFormData.label,
        ref: this.uploadFormData.ref,
        isBorrowed: false,
        owner: {
          id: this.me.id,
          fullName: this.me.fullName
        }
      });

      // Add the new thing to the list
      this.things.unshift(newItem);

      // Close the modal.
      this._clearUploadThingModal();
    },

    submittedEditThingForm: function(result) {
      // var newItem = _.extend(result, {
      //   label: this.uploadFormData.label,
      //   ref: this.uploadFormData.ref,
      //   isBorrowed: false,
      //   owner: {
      //     id: this.me.id,
      //     fullName: this.me.fullName
      //   }
      // });

      // Close the modal.
      this._clearEditThingModal();
    },

    editFileInput: function(files) {
      if (files.length !== 1 && !this.editFormData.photo) {
        throw new Error('Consistency violation: `changeFileInput` was somehow called with an empty array of files, or with more than one file in the array!  This should never happen unless there is already an uploaded file tracked.');
      }
      var selectedFile = files[0];

      // If you cancel from the native upload window when you already
      // have a photo tracked, then we just avast (return early).
      // In this case, we just leave whatever you had there before.
      if (!selectedFile && this.editFormData.photo) {
        return;
      }

      this.editFormData.photo = selectedFile;

      // Set up the file preview for the UI:
      var reader = new FileReader();
      reader.onload = (event)=>{
        this.editFormData.previewImageSrc = event.target.result;

        // Unbind this "onload" event.
        delete reader.onload;
      };
      // Clear out any error messages about not providing an image.
      this.formErrors.photo = false;
      reader.readAsDataURL(selectedFile);
    },

    changeFileInput: function(files) {
      if (files.length !== 1 && !this.uploadFormData.photo) {
        throw new Error('Consistency violation: `changeFileInput` was somehow called with an empty array of files, or with more than one file in the array!  This should never happen unless there is already an uploaded file tracked.');
      }
      var selectedFile = files[0];

      // If you cancel from the native upload window when you already
      // have a photo tracked, then we just avast (return early).
      // In this case, we just leave whatever you had there before.
      if (!selectedFile && this.uploadFormData.photo) {
        return;
      }

      this.uploadFormData.photo = selectedFile;

      // Set up the file preview for the UI:
      var reader = new FileReader();
      reader.onload = (event)=>{
        this.uploadFormData.previewImageSrc = event.target.result;

        // Unbind this "onload" event.
        delete reader.onload;
      };
      // Clear out any error messages about not providing an image.
      this.formErrors.photo = false;
      reader.readAsDataURL(selectedFile);
    },

    clickEditThing: function(thingId) {
      this.selectedThing = _.find(this.things, {id: thingId});

      // Open the modal.
      this.confirmEditThingModalOpen = true;
    },

    clickDeleteThing: function(thingId) {
      this.selectedThing = _.find(this.things, {id: thingId});

      // Open the modal.
      this.confirmDeleteThingModalOpen = true;
    },

    closeEditThingModal: function() {
      this.selectedThing = undefined;
      this.confirmEditThingModalOpen = false;
      this.cloudError = '';
    },

    closeDeleteThingModal: function() {
      this.selectedThing = undefined;
      this.confirmDeleteThingModalOpen = false;
      this.cloudError = '';
    },

    handleParsingDeleteThingForm: function() {
      return {
        id: this.selectedThing.id
      };
    },

    submittedDeleteThingForm: function() {

      // Remove the thing from the list
      _.remove(this.things, {id: this.selectedThing.id});

      // Close the modal.
      this.selectedThing = undefined;
      this.confirmDeleteThingModalOpen = false;
    },

  }
});
