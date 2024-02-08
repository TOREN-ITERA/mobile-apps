import { AlertDialog, Button } from "native-base";
import React, { memo, useRef } from "react";
import { BASE_COLOR } from "../../utilities/baseColor";

interface ModalTypes {
  openModel: boolean;
  onCloseModal: any;
  btnYesTitle: string;
  btnNoTitle: string;
  modalText: string;
  modalHeaderTitle: string;
  onBtnYesClick?: any;
}

const ModalPrimary = (props: ModalTypes) => {
  const {
    openModel,
    onCloseModal,
    modalHeaderTitle,
    modalText,
    btnNoTitle,
    btnYesTitle,
    onBtnYesClick,
  } = props;
  const cancelRef = useRef(null);

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={openModel}
      onClose={onCloseModal}
    >
      <AlertDialog.Content>
        <AlertDialog.Header>{modalHeaderTitle}</AlertDialog.Header>
        <AlertDialog.Body>{modalText}</AlertDialog.Body>
        <AlertDialog.Footer>
          <Button.Group space={2}>
            <Button
              colorScheme="gray"
              size={"lg"}
              onPress={onCloseModal}
              ref={cancelRef}
            >
              {btnNoTitle}
            </Button>
            <Button
              colorScheme="blue"
              size={"lg"}
              onPress={() => {
                onCloseModal();
                onBtnYesClick();
              }}
            >
              {btnYesTitle}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default memo(ModalPrimary);
