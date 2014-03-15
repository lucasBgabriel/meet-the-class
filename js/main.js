/*
 * This file contains all JavaScript that makes the app work.
 *
 * Most of the drag and drop functionality was adapted from a great tutorial
 * from HTML5 Rocks: http://www.html5rocks.com/en/tutorials/dnd/basics/
 *
 */

/*
 * This function will be executed once the DOM has finished loading.
 */

$(function() {
  $('.empty-places-count')[0].innerHTML = people.length;
});

/*
 * Creates unseated people, for each person in the `people` array.
 * See the data.js file for more information on people.
 */

[].forEach.call(people, function(person) {
  person_element = $('<div class="person" draggable="true"><span>' + person.first_name + '</span></div>');
  person_element.find('span').data('who', person);
  $('#people').append(person_element);
});

/*
 * Binds people and places to drag and drop events.
 */

var draggables = document.querySelectorAll('.person, .place');

[].forEach.call(draggables, function(draggable) {
  draggable.addEventListener('dragstart', handleDragStart, false);
  draggable.addEventListener('dragend', handleDragEnd, false);
  draggable.addEventListener('drop', handleDrop, false);
  draggable.addEventListener('dragenter', handleDragEnter, false);
  draggable.addEventListener('dragover', handleDragOver, false);
  draggable.addEventListener('dragleave', handleDragLeave, false);
});

/*
 * Binds unseated people area to drag and drop events.
 */

var unseated_area = document.querySelectorAll('.bla');

[].forEach.call(unseated_area, function(col) {
  col.addEventListener('dragstart', function() {}, false);
  col.addEventListener('dragend', handleDragEnd, false);
  col.addEventListener('drop', handleDrop, false);
  col.addEventListener('dragenter', handleDragEnter, false);
  col.addEventListener('dragover', handleDragOver, false);
  col.addEventListener('dragleave', handleDragLeave, false);
});

/*
 * Binds people's names to the detailed information modal.
 */

var names = document.querySelectorAll('.person span');

[].forEach.call(names, function(span) {
  span.addEventListener('click', function() {
    /* Populates the modal with information. */
    who = $(this).data('who');
    $('.about img')[0].src = "http://www.gravatar.com/avatar/" +
      (who.picture || Math.floor(Math.random() * 100)) + "?d=wavatar";
    $('.about h4')[0].innerHTML = who.full_name;
    $('.about .info.course')[0].innerHTML = who.course || 'Unknown course';
    $('.about .info.birthday')[0].innerHTML =
      who.birthday || 'Unknown birthday';
    $('.about .info.about-person')[0].innerHTML =
      who.about || 'No information about this person is available';
    /* Shows the modal. */
    $('.about').css('display', 'block');
  }, false);
});

/*
 * Binds the "close modal" event.
 */

$('.about .hide').on('click', function() {
  $('.about').css('display', 'none');
})


/* ==========================================================================
   Drag and Drop callbacks
   Documentation extracted from the Mozilla Developer Network (MDN) at:
   https://developer.mozilla.org/en-US/docs/DragDrop/Drag_and_Drop
   ========================================================================== */

/*
 * Fired on an element when a drag is started.
 */

function handleDragStart(e) {
  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}

/*
 * This event is fired as the mouse is moved over an element when a drag
 * is occuring.
 */

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';

  return false;
}

/*
 * Fired when the mouse is first moved over an element while a drag
 * is occurring.
 */

function handleDragEnter(e) {
  this.classList.add('over');
}

/*
 * Fired when the mouse leaves an element while a drag is occurring.
 */

function handleDragLeave(e) {
  this.classList.remove('over');
}

/*
 * Fired on the element where the drop occurred at the end of the drag
 * operation. A listener would be responsible for retrieving the data
 * being dragged and inserting it at the drop location.
 * This event will only fire if a drop is desired.
 */


function handleDrop(e) {

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  this.classList.remove('over');

  /*
   * Don't do anything if dropping the same column we're dragging or if
   * the dragged element is a person from the unseated area who is already
   * seated.
   */
  if (dragSrcEl != this && !dragSrcEl.classList.contains('seated')) {

    /*
     * Case: SEATED-PERSON -> UNSEATED-AREA || UNSEATED-PERSON
     */
    if (dragSrcEl.classList.contains('place')
          && (this.classList.contains('bla') || this.classList.contains('person')))  {

      /*
       * Find the person in the unseated are and re-enable that element
       * (which was previously disabled). Also, remove the person from
       * their current seat.
       */

      // All names are are disabled (ie, that represent seated people).
      seated_people = document.querySelectorAll('.seated');
      // If the person we're looking for was found, and we can break the loop.
      found_person = false;
      // Counter variable.
      i = 0;

      while (found_person == false) {
        person = seated_people[i];
        if (person.innerHTML == dragSrcEl.innerHTML) {
          // Remove the person from the current seat.
          dragSrcEl.innerHTML = "";
          // Re-enable the person in the unseated area.
          person.classList.remove('seated');
          // Stop the loop.
          found_person = true;
        }
        i++;
      }
    }
    /*
     * Case: UNSEATED-PERSON -> UNSEATED-PERSON
     */
    else if (this.classList.contains('person') &&
      dragSrcEl.classList.contains('person')) {
      // Don't do anything.
    }
    /*
     * Case: SEATED-PERSON -> SEATED-PERSON
     */
    else if (dragSrcEl.classList.contains('place')) {
      // Swaps the two.
      temp = this.innerHTML;
      this.innerHTML = dragSrcEl.innerHTML;
      dragSrcEl.innerHTML = temp;
    }
    /*
     * Case: UNSEATED-PERSON -> EMPTY-PLACE
     */
    else {
      this.innerHTML = dragSrcEl.innerHTML;
      dragSrcEl.classList.add('seated');
    }
  }

  // Updates the empty places count.
  $('.empty-places-count')[0].innerHTML = $('.person:not(.seated)').length;

  return false;
}

/*
 * The source of the drag will receive a dragend event when the drag
 * operation is complete.
 */
function handleDragEnd(e) {
  [].forEach.call(document.querySelectorAll('.person'), function (col) {
    col.classList.remove('over');
  });
}
