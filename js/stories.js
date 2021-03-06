"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList.stories);
  $('.delete').hide();                  // delete not available from main stories view
  if(!currentUser) {                    // if there is no logged in user hide the favorite icons
    $('.favorite').hide();
  }
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();
  let favoriteStatus = 'far';           // default favorite status is not a favorite (far)
  if(currentUser){                      // if there is a logged in user determine whether or not the story is one of their favorites
    favoriteStatus = story.getFavoriteStatus();     // class=far is not a favorite, class=fas is a favorite
  }
  
  return $(`
      <li id="${story.storyId}">
      <i class="favorite ${favoriteStatus} fa-star"></i>
      <i class="delete fas fa-trash-alt"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(stories) {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

// Get user input from new story form and post new story

async function addStoryClick(evt) {
  console.debug('addStoryClick', evt);
  evt.preventDefault();

  const newStory = {
    'title': $('#new-story-title').val(),
    'author': $('#new-story-author').val(),
    'url': $('#new-story-url').val()
  };
  $('#new-story-title').val('');
  $('#new-story-author').val('');
  $('#new-story-url').val('');
  await storyList.addStory(currentUser, newStory);
  hidePageComponents();
  putStoriesOnPage(storyList.stories);
  $('.delete').hide();                  // delete not available from main stories view
  if(!currentUser) {                    // if there is no logged in user hide the favorite icons
    $('.favorite').hide();
  }
}

$newStoryForm.on('submit',addStoryClick);

async function handleFavoriteClick(evt) {
  const $favIcon = $(evt.target);
  console.log($favIcon);
  
  const storyId = $favIcon.parent().attr('id');
  console.log(storyId);

  const favoriteStoryIndex = currentUser.favorites.findIndex(favorite => favorite.storyId === storyId);
  const isCurrentlyFavorite = (favoriteStoryIndex > -1) ? true : false
  if(isCurrentlyFavorite) {
    if(await currentUser.removeFavorite(storyId) === true){
      // update icon
      if($favIcon.hasClass('fas')) {
        $favIcon.removeClass('fas');
        $favIcon.addClass('far');
      }
    }
  } else {
    if(await currentUser.addFavorite(storyId) === true) {
      // update icon
      if($favIcon.hasClass('far')) {
        $favIcon.removeClass('far');
        $favIcon.addClass('fas');
      }
    }
  }
}

$allStoriesList.on('click', '.favorite', handleFavoriteClick)

function handleMyStoriesClick() {
  console.debug('clicked my stories')
  putStoriesOnPage(currentUser.ownStories);
  $('.delete').show();                  // delete not available from main stories view
  $('.favorite').hide();              // if there is no logged in user hide the favorite icons
}

$navMyStories.on('click', handleMyStoriesClick);

async function handleRemoveStoryClick(evt) {
  console.debug('clicked remove story');
  const storyId = $(evt.target).parent().attr('id');
  console.log(storyId);
  // remove story from API and local
  await storyList.removeStory(storyId);
  // remove story from DOM
  $(`#${storyId}`).remove();
}

$allStoriesList.on('click', '.delete', handleRemoveStoryClick);