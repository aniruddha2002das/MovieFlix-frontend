import React, { useEffect, useState } from "react";
import Container from "../Container";
import { BsTrash, BsPencilSquare } from "react-icons/bs";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import { useParams } from "react-router-dom";
import { deleteReview, getReviewByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";
import ConfirmModal from "../../models/ConfirmModal";
import NotFoundText from "./../NotFoundText";
import EditRatingModal from "../../models/EditRatingModal";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [profileOwnerReview, setProfileOwnerReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(false);
  const [busy, setBusy] = useState(false);

  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  const fetchReviews = async () => {
    const { error, movie } = await getReviewByMovie(movieId);

    if (error) return updateNotification("error", error);
    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  const findProfileOwnersReview = () => {
    if (profileOwnerReview) return setProfileOwnerReview(null);

    const matched = reviews.find((review) => review.owner.id === profileId);

    if (!matched)
      return updateNotification("error", "You don't have any review.");

    setProfileOwnerReview(matched);
  };

  const displayConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const hideConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const hideEditModal = () => {
    setShowEditModal(false);
    setSelectedReview(null);
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnerReview;
    setSelectedReview({
      id,
      content,
      rating,
    });

    setShowEditModal(true);
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = {
      ...profileOwnerReview,
      rating: review.rating,
      content: review.content,
    };

    setProfileOwnerReview({ ...updatedReview });

    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });

    setReviews([...newReviews]);
  };

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnerReview.id);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    const updateReviews = reviews.filter((r) => r.id !== profileOwnerReview.id);
    setReviews([...updateReviews]);

    setProfileOwnerReview(null);
    hideConfirmModal();
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  return (
    <div className=" dark:bg-primary bg-white min-h-screen pb-10">
      <Container className=" xl:px-0 px-2 py-8">
        <div className="flex justify-between items-center">
          <h1 className=" text-2xl font-semibold dark:text-white text-secondary">
            <span className=" text-light-subtle dark:text-dark-subtle font-normal">
              Reviews For :
            </span>{" "}
            {movieTitle}
          </h1>

          {profileId ? (
            <CustomButtonLink
              label={profileOwnerReview ? "View All" : "Find My Review"}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>

        <NotFoundText text="No Reviews !" visible={!reviews.length} />

        {profileOwnerReview ? (
          <div>
            <ReviewCard review={profileOwnerReview} />
            <div className="flex space-x-3 dark:text-white text-primary text-xl p-3 px-0">
              <button onClick={displayConfirmModal} type="button">
                <BsTrash />
              </button>
              <button onClick={handleOnEditClick} type="button">
                <BsPencilSquare />
              </button>
            </div>
          </div>
        ) : (
          <div className=" space-y-3 mt-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        busy={busy}
        visible={showConfirmModal}
        onConfirm={handleDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure ?"
        subtitle="This action will remove your review permanently!"
      />

      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModal}
      />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;
  const { owner, content, rating } = review;

  return (
    <div className="flex space-x-3 mt-2 items-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>
      <div>
        <h1 className=" dark:text-white  text-secondary font-semibold text-lg">
          {owner.name}
        </h1>
        <RatingStar rating={rating} />
        <p className=" text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
