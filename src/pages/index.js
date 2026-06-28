import {
  enableValidation,
  settings,
  toggleButtonState,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import "../pages/index.css";
import Api from "../utils/Api.js";

const initialCards = [
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
  {
    name: "Val Thomas",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "81e9b6f3-e824-478a-a215-d98f4ceaa355",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, user]) => {
    console.log(cards);
    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    linkInputEl.src = user.avatar;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileSubmitBtn = editProfileModal.querySelector(
  ".modal__submit-button",
);

const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button",
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostButton = document.querySelector(".profile__add-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");

const linkInputEl = newPostModal.querySelector("#card-image-input");
const captionInputEl = newPostModal.querySelector("#profile-caption-input");
const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const cardSubmitBtn = newPostModal.querySelector(".modal__submit-button");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-button");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const avatarModal = document.querySelector("#avatar-modal");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-button");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-button");
const avatarForm = avatarModal.querySelector(".modal__form");
const profileAvatarEl = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form_type_delete");
const cancelBtn = deleteModal.querySelector(".modal__cancel-button");
const closeBtnPreview = deleteModal.querySelector(
  ".modal__close-button_type_preview",
);

avatarModalCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

closeBtnPreview.addEventListener("click", function () {
  closeModal(deleteModal);
});

enableValidation(settings);

cancelBtn.addEventListener("click", function () {
  closeModal(deleteModal);
});
previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

const cardsList = document.querySelector(".cards__list");

const cardTemplate = document.querySelector("#card-template");
let selectedCard, selectedCardId;

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  cardImageEl.src = data.link;

  const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-button_active");
  }

  cardLikeBtnEl.addEventListener("click", () => {
    if (cardLikeBtnEl.classList.contains("card__like-button_active")) {
      api
        .unlikeCard(data._id)
        .then((updatedCard) => {
          cardLikeBtnEl.classList.remove("card__like-button_active");
        })
        .catch(console.error);
    } else {
      api
        .likeCard(data._id)
        .then((updatedCard) => {
          cardLikeBtnEl.classList.add("card__like-button_active");
        })
        .catch(console.error);
    }
  });
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

  function handleDeleteCard(cardElement, data) {
    selectedCard = cardElement;
    selectedCardId = data._id;

    openModal(deleteModal);
  }

  cardDeleteBtnEl.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}
function handleEscape(evt) {
  if (evt.key === "Escape") {
    closeModal(document.querySelector(".modal_is-opened"));
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(editProfileForm, [
    editProfileNameInput,
    editProfileDescriptionInput,
  ]);
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = avatarForm.querySelector(".modal__submit-button");
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Saving...";

  api
    .updateAvatar(avatarInputEl.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      avatarForm.reset();
      closeModal(avatarModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
    });
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();

  const submitBtn = deleteForm.querySelector(".modal__submit-button");
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
    });
}

avatarForm.addEventListener("submit", handleAvatarSubmit);

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileDescriptionEl.textContent = data.about;
      profileNameEl.textContent = data.name;

      closeModal(editProfileModal);
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostSubmit(evt) {
  evt.preventDefault();

  const submitBtn = cardSubmitBtn;
  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Saving...";

  const inputValues = {
    name: captionInputEl.value,
    link: linkInputEl.value,
  };

  api
    .addCard(inputValues)
    .then((newCard) => {
      const cardElement = getCardElement(newCard);
      cardsList.prepend(cardElement);

      evt.target.reset();
      closeModal(newPostModal);
      disableButton(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = originalText;
    });
}

newPostModal.addEventListener("submit", handleNewPostSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
