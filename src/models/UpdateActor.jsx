import React, { useState } from "react";
import ModalContainer from "./ModalContainer";
import ActorForm from "../components/admin/ActorForm";
import { updateActor } from "../api/actor";
import { useNotification } from "../hooks";

export default function UpdateActor({ visible, initialState,onSuccess, onClose }) {
  const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, actor } = await updateActor(initialState.id, data);
    setBusy(false);

    if (error) {
      return updateNotification("error", error);
    }

    onSuccess(actor);
    updateNotification("success", "Actor updated successfully!");
    onClose();
  };

  return (
    <ModalContainer ignoreContainer visible={visible} onClose={onClose}>
      <ActorForm
        onSubmit={!busy ? handleSubmit : null}
        title="Update Actor"
        btnTitle="Update"
        busy={busy}
        initialState={initialState}
      />
    </ModalContainer>
  );
}
