class View {
  constructor() {
    this.alertBox;
    this.postFormContainer = document.getElementById('post-form-container');
    this.postFormTitle = document.getElementById('post-form-title');
    this.postForm = document.getElementById('post-form');
    this.postTitleInput = document.getElementById('post-title-input');
    this.postBodyInput = document.getElementById('post-body-input');
    this.submitPostButton = document.getElementById('submit-post-button');
    this.cancelEditButton;
    this.postsList = document.getElementById('posts-list');

    this.lastAlert;
  }

  // Renders all posts to the UI
  renderPosts(posts) {
    if (posts.length === 0)
      return this.postsList.innerHTML = `
        <div class="notification is-dark">No posts to show.</div>
      `;
    
    let postsHTML = '';
    posts.forEach(post => postsHTML += `
      <div class="card">
        <div class="card-header has-background-dark">
          <h3 class="card-header-title has-text-white">${post.title}</h3>
        </div>
        <div class="card-content">
          <div class="content">${post.body}</div>
        </div>
        <footer class="card-footer">
          <a
            class="edit-post-button card-footer-item has-background-warning has-text-dark"
            data-id="${post.id}"
          >Edit</a>
          <a
            class="delete-post-button card-footer-item has-background-danger has-text-white"
            data-id="${post.id}"
          >Delete</a>
        </footer>
      </div>
    `);

    this.postsList.innerHTML = postsHTML;
  }

  // Clears the alert in the UI
  clearAlert() {
    if (this.alertBox) {
      // Prevent the timeout removal of the last alert
      clearTimeout(this.lastAlert);
      this.lastAlert = null;

      this.alertBox.remove();
      this.alertBox = null;
    }
  }

  // Renders an alert to the UI
  renderAlert(message, isSuccess) {
    this.clearAlert();

    this.alertBox = document.createElement('div');

    this.alertBox.className = `notification ${isSuccess ? 'is-success' : 'is-danger'}`;
    this.alertBox.textContent = message;

    this.postFormContainer.insertBefore(this.alertBox, this.postForm);

    this.lastAlert = setTimeout(() => this.clearAlert(), 3000);
  }

  // Gets user inputs
  getInputs() {
    return {title: this.postTitleInput.value, body: this.postBodyInput.value};
  }

  // Resets the form
  resetForm() {
    this.postTitleInput.value = '';
    this.postBodyInput.value = '';

    this.postTitleInput.focus();
  }

  // Renders the add form
  renderAddForm() {
    this.postFormTitle.textContent = 'Add Post';

    this.resetForm();

    this.submitPostButton.className = 'button is-info';
    this.submitPostButton.textContent = 'Add';

    if (this.cancelEditButton) {
      this.cancelEditButton.remove();
      this.cancelEditButton = null;
    }
  }

  // Renders the edit form
  renderEditForm(post) {
    this.postFormTitle.textContent = 'Edit Post';

    this.postTitleInput.value = post.title;
    this.postBodyInput.value = post.body;

    this.submitPostButton.className = 'button is-warning';
    this.submitPostButton.textContent = 'Update';

    this.cancelEditButton = document.createElement('button');
    this.cancelEditButton.id = 'cancel-edit';
    this.cancelEditButton.className = 'button is-warning is-light is-outlined';
    this.cancelEditButton.type = 'button';
    this.cancelEditButton.textContent = 'Cancel';

    this.postForm.appendChild(this.cancelEditButton);
  }

  // Toggles the form mode
  toggleForm(id, post) {
    if (! id) return this.renderAddForm();
    this.renderEditForm(post);
  }
}

export default new View();
