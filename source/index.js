import request from './Request';
import view from './View';
import controller from './Controller';

const resourceURL = 'http://localhost:3000/posts';

// Duplicate an object
const duplicate = object => JSON.parse(JSON.stringify(object));

/* Create local states */
const posts = controller.createState('posts', []);
const editPostId = controller.createState('editPostId', null);

/* Add effects to run on state updates */
// Render the posts on state change
posts.addEffect(posts => view.renderPosts(posts));

// Toggle form on state update
editPostId.addEffect(id => {
  const post = (id && posts.value.length > 0)
    && duplicate(posts.value.find(post => post.id === editPostId.value));
  view.toggleForm(id, post);
});

// Render add form on edit cancellation
editPostId.addEffect(() => {
  if (view.cancelEditButton)
    view.cancelEditButton.addEventListener('click', () => {
      editPostId.updateState(null);

      view.renderAddForm()
    });
});

// Initializes the app
const initialize = async () => {
  editPostId.updateState(null);
  
  // Get all posts from database
  let postsArray;

  try {
    postsArray = await request.get(resourceURL);
  } catch (error) {
    postsArray = [];

    view.renderAlert('Could not connect to the server.');
  }

  posts.updateState(postsArray);
};

// Adds or updates a post
const addOrUpdatePost = async event => {
  event.preventDefault();

  const {title, body} = view.getInputs();

  if (! title || ! body)
    return view.renderAlert('All the fields are required.');
  
  if (! editPostId.value) {
    // Add a post to state
    const post = {
      id: Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`),
      title, body
    };

    // Add a post to database
    try { await request.post(resourceURL, post); }
    catch (error) {
      return view.renderAlert('Could not connect to the server');
    }

    posts.updateState([...posts.value, post]);

    view.resetForm();

    return view.renderAlert('Post has been added.', true);
  }

  // Update a post in state
  const postsArray = duplicate(posts.value);

  const post = postsArray.find(post => post.id === editPostId.value);

  post.title = title;
  post.body = body;

  // Update a post in database
  try { await request.put(`${resourceURL}/${post.id}`, post); }
  catch (error) {
    return view.renderAlert('Could not connect to the server');
  }

  posts.updateState(postsArray);

  editPostId.updateState(null);

  view.renderAlert('Post has been updated.', true)
};

// Renders edit form or deletes a post from state
const editOrDeletePost = async event => {
  // Change the edit post state
  if (event.target.classList.contains('edit-post-button'))
    return editPostId.updateState(Number(event.target.dataset.id));
  
  // Delete a post from state
  if (event.target.classList.contains('delete-post-button')) {
    const postId = Number(event.target.dataset.id);
    const postsArray = duplicate(posts.value);

    const index = postsArray.indexOf(postsArray.find(
      post => post.id === postId
    ));

    postsArray.splice(index, 1);

    // Delete a post from database
    try { await request.delete(`${resourceURL}/${postId}`); }
    catch (error) {
      return view.renderAlert('Could not connect to the server');
    }

    posts.updateState(postsArray);

    view.renderAlert('Post has been deleted.', true)
  }
};

/* Add event listeners */
document.addEventListener('DOMContentLoaded', initialize);

view.postForm.addEventListener('submit', addOrUpdatePost);

view.postsList.addEventListener('click', editOrDeletePost);
