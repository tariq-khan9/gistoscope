import React from "react";
import { Modal } from "antd";
import ModalActionButtons from "./ModalActionButtons";

interface NodeActionModalProps {
  visible: boolean;
  position: { x: number; y: number };
  nodeTitle: string | null;
  onClose: () => void;
  setModalAction: (action: string) => void;
}

const NodeActionModal: React.FC<NodeActionModalProps> = ({
  visible,
  position,
  nodeTitle,
  onClose,
  setModalAction,
}) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      style={{
        top: position.y,
        left: position.x,
        position: "absolute",
      }}
      width={300}
      mask={false}
      destroyOnClose
    >
      <h3>{nodeTitle}</h3>
      {/* Replace ActionButtons with logic if it requires the modalAction */}
      <ModalActionButtons />
    </Modal>
  );
};

export default NodeActionModal;
