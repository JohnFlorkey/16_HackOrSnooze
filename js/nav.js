"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage(storyList.stories);
  $('.delete').hide();                  // delete not available from main stories view
  if(!currentUser) {                    // if there is no logged in user hide the favorite icons
    $('.favorite').hide();
  }
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navUser.show();
}

/** Show new story form on click on "submit"*/

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $newStoryForm.show();
}

$navSubmit.on('click', navSubmitClick);

// show favorites when user clickes favorite in nav

function navFavoriteClick(evt) {
  console.debug('navFavoriteClick', evt);
  hidePageComponents();
  putStoriesOnPage(currentUser.favorites);
  $('.delete').hide();                  // delete not available from main stories view
  if(!currentUser) {                    // if there is no logged in user hide the favorite icons
    $('.favorite').hide();
  }
}

$navFavorite.on('click', navFavoriteClick);