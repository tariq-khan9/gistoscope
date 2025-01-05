import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Modal, Form, Input, Button, notification } from "antd";
import { useMutation } from "@apollo/client";

import {
  CREATE_GIST,
  CREATE_VERSION,
  CREATE_EDIT,
} from "../../services/graphql/queriesMutations";
import RichEditor from "../dashboard/RichEditor";

type FormValues = {
  title: string;
  point: string;
  body: string;
};

const CreateGistModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  subjectId: number | undefined;
}> = ({ visible, onClose, subjectId }) => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>("");
  const [createGist] = useMutation(CREATE_GIST);
  const [createVersion] = useMutation(CREATE_VERSION);
  const [createEdit] = useMutation(CREATE_EDIT);

  const handleSubmit = async (values: FormValues) => {
    try {
      // Step 1: Create a Gist and get its ID
      const gistResponse = await createGist({
        variables: {
          gist: {
            title: values.title,
            userId: 1,
            createdAt: new Date().toISOString(),
            subjectId: subjectId,
          },
        },
      });

      const gistId: number = gistResponse.data.addGist.id;

      // Step 2: Use the Gist ID to create a Version and get its ID
      if (gistId) {
        const versionResponse = await createVersion({
          variables: {
            version: {
              gistId: gistId,
              point: values.point,
              userId: 1,
              createdAt: new Date().toISOString(),
            },
          },
        });

        const versionId = versionResponse.data.addVersion.id;
        if (versionId) {
          const editResponse = await createEdit({
            variables: {
              edit: {
                versionId: versionId,
                body: content,
                userId: 1,
                createdAt: new Date().toISOString(),
              },
            },
          });

          if (editResponse.data) {
            notification.success({
              message: "Success",
              description: "Gist created successfully!",
            });
            form.resetFields();
            setContent("");
            onClose();
          }
        }
      } else {
        notification.error({
          message: "Error",
          description: "Failed to create Gist. Please try again.",
        });
      }
    } catch (e) {
      console.error("Error creating Gist, Version, or Edit", e);
      notification.error({
        message: "Error",
        description: "An error occurred while creating the Gist.",
      });
    }
  };

  return (
    <Modal
      title="Create Gist"
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ title: "", point: "" }}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title is required" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>

        <Form.Item
          label="Point"
          name="point"
          rules={[{ required: true, message: "Point is required" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Enter a brief point for the gist"
          />
        </Form.Item>

        <Form.Item label="Body">
          <RichEditor
            editable={false}
            content={content}
            setContent={setContent}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Gist
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateGistModal;
