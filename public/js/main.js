document.addEventListener('DOMContentLoaded', () => {

  const deleteButtons = document.querySelectorAll('.btn-delete');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const songTitle = button.getAttribute('data-song-title') || 'esta canción';
      const confirmed = window.confirm(
        `¿Estás seguro de que deseas eliminar "${songTitle}"?\n\nEsta acción no se puede deshacer.`
      );

      if (!confirmed) {
        event.preventDefault();
      }
    });
  });

  const alerts = document.querySelectorAll('.alert.alert-dismissible');

  alerts.forEach((alertEl) => {
    setTimeout(() => {
      if (window.bootstrap && window.bootstrap.Alert) {
        const bsAlert = window.bootstrap.Alert.getOrCreateInstance(alertEl);
        bsAlert.close();
      } else {
        alertEl.classList.remove('show');
        alertEl.classList.add('d-none');
      }
    }, 5000);
  });

  const searchInput = document.querySelector('input[name="q"]');

  document.addEventListener('keydown', (event) => {
    const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

    if (event.key === '/' && !isTyping && searchInput) {
      event.preventDefault();
      searchInput.focus();
    }
  });

});