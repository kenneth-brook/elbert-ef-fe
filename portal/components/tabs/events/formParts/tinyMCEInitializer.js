export const initializeTinyMCE = (selector) => {
    tinymce.init({
      selector: selector,
      license_key: 'gpl',
      plugins: 'link code',
      toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code',
      setup: (editor) => {
        editor.on('change', () => {
          editor.save(); // Ensure the content is saved to the textarea
        });
      },
    });
  };